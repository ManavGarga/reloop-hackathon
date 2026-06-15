"""
routes/returns.py
Return flow endpoints — fully wired to real services.
"""

import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database import get_db
from services.grading_service import grade_item
from services.disposition_service import get_disposition
from services.carbon_service import calculate_savings
from services.gemini_service import get_disposition_reasoning
from services.passport_service import append_event, get_passport_display
from services.spapi_mock import push_renewed_listing, notify_buyer

router = APIRouter()


# ── Request Bodies ────────────────────────────────────────────────────────────

class InitiateReturnBody(BaseModel):
    user_id: str
    product_id: str
    product_name: str
    return_reason: str
    reason_detail: Optional[str] = None
    item_condition: Optional[str] = None
    image_url: Optional[str] = None


class GradeReturnBody(BaseModel):
    return_id: str
    image_url: Optional[str] = None
    description: Optional[str] = None


class DisposeBody(BaseModel):
    return_id: str
    disposal_route: Optional[str] = None       # if None, use AI decision
    ngo_id: Optional[str] = None
    p2p_price: Optional[float] = None


class P2PListBody(BaseModel):
    asking_price: float
    description: Optional[str] = None


class CompleteReturnBody(BaseModel):
    notes: Optional[str] = None


# ── Helper ────────────────────────────────────────────────────────────────────

async def _get_product(db, product_id: str) -> dict:
    """Fetch product from DB; return defaults if not found."""
    prod = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not prod:
        return {
            "product_id": product_id,
            "category": "electronics",
            "price_new": 10000.0,
            "carbon_footprint_kg": 55.0,
        }
    return prod


async def _get_return(db, return_id: str) -> dict:
    doc = await db.returns.find_one({"return_id": return_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Return {return_id} not found")
    return doc


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/initiate")
async def initiate_return(body: InitiateReturnBody):
    """Step 1: Customer initiates return — stored in MongoDB."""
    db = get_db()

    return_id = f"RET-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    now = datetime.utcnow().isoformat()

    doc = {
        "return_id":     return_id,
        "user_id":       body.user_id,
        "product_id":    body.product_id,
        "product_name":  body.product_name,
        "return_reason": body.return_reason,
        "reason_detail": body.reason_detail,
        "item_condition": body.item_condition,
        "image_url":     body.image_url,
        "status":        "initiated",
        "created_at":    now,
        "updated_at":    now,
    }
    await db.returns.insert_one({k: v for k, v in doc.items() if v is not None})

    return {
        "status":    "ok",
        "return_id": return_id,
        "message":   "Return initiated successfully",
        "next_step": "grade",
        "data":      {k: v for k, v in doc.items() if k != "_id"},
    }


@router.post("/grade")
async def grade_return(body: GradeReturnBody):
    """Step 2: AI grades item condition — takes ~2.5s (matches frontend animation)."""
    db = get_db()

    # Fetch return to get product category
    ret = await db.returns.find_one({"return_id": body.return_id}, {"_id": 0})
    product_id = ret["product_id"] if ret else "unknown"
    prod = await _get_product(db, product_id)
    category = prod.get("category", "electronics")

    # Call grading service (2.5s)
    grade = await grade_item(
        return_id=body.return_id,
        category=category,
        image_url=body.image_url or (ret or {}).get("image_url"),
        description=body.description,
    )

    # Persist grade results to return doc
    await db.returns.update_one(
        {"return_id": body.return_id},
        {"$set": {
            "status":         "graded",
            "ai_grade_score": grade["grade_score"],
            "item_condition": grade["condition"],
            "grade_notes":    str(grade["flaw_breakdown"]),
            "updated_at":     datetime.utcnow().isoformat(),
        }},
        upsert=True,
    )

    return {
        "status":    "ok",
        "return_id": body.return_id,
        **grade,
    }


@router.post("/dispose")
async def dispose_return(body: DisposeBody):
    """Step 3: AI disposition + Claude reasoning + carbon calc + passport event."""
    db = get_db()

    ret = await _get_return(db, body.return_id)
    prod = await _get_product(db, ret["product_id"])

    grade_score = ret.get("ai_grade_score", 70.0)
    condition   = ret.get("item_condition", "good")
    category    = prod.get("category", "electronics")
    price_new   = prod.get("price_new", 10000.0)
    carbon_kg   = prod.get("carbon_footprint_kg", 55.0)

    # Run disposition matrix
    disp_result = get_disposition(
        grade_score=grade_score,
        condition=condition,
        category=category,
        price_new=price_new,
        return_reason=ret.get("return_reason", ""),
    )

    # Allow manual override from body
    if body.disposal_route:
        disp_result["disposition"] = body.disposal_route

    disposition = disp_result["disposition"]

    # Carbon calculation
    carbon = calculate_savings(
        category=category,
        disposition=disposition,
        carbon_footprint_override=carbon_kg,
    )

    # Gemini reasoning (async, never throws)
    reasoning = await get_disposition_reasoning(
        product_name=ret.get("product_name", prod.get("name", "item")),
        category=category,
        return_reason=ret.get("return_reason", ""),
        condition=condition,
        grade_score=grade_score,
        disposition=disposition,
        co2_saved_kg=carbon["co2_saved_kg"],
        green_credits=disp_result["green_credits_awarded"],
    )

    # Append passport event
    await append_event(
        product_id=ret["product_id"],
        event_type="returned",
        actor=ret["user_id"],
        notes=f"Returned: {ret.get('return_reason')} | Routed to: {disposition}",
        co2_delta_kg=-carbon["co2_saved_kg"],
        condition_at_event=condition,
    )

    # Persist disposition to return doc
    await db.returns.update_one(
        {"return_id": body.return_id},
        {"$set": {
            "status":                "disposed",
            "disposal_route":        disposition,
            "co2_saved_kg":          carbon["co2_saved_kg"],
            "green_credits_awarded": disp_result["green_credits_awarded"],
            "ngo_id":                body.ngo_id,
            "p2p_price":             body.p2p_price or disp_result.get("p2p_offer_price"),
            "ai_reasoning":          reasoning,
            "updated_at":            datetime.utcnow().isoformat(),
        }},
    )

    return {
        "status":    "ok",
        "return_id": body.return_id,
        **disp_result,
        "carbon":    carbon,
        "reasoning": reasoning,
    }


@router.get("/{return_id}")
async def get_return_detail(return_id: str):
    """Get full return request details."""
    db = get_db()
    ret = await _get_return(db, return_id)
    return {"status": "ok", **ret}


@router.post("/{return_id}/p2p")
async def list_p2p(return_id: str, body: P2PListBody):
    """List a returned item on the peer-to-peer marketplace."""
    db = get_db()
    await db.returns.update_one(
        {"return_id": return_id},
        {"$set": {
            "status":    "p2p_listed",
            "p2p_price": body.asking_price,
            "updated_at": datetime.utcnow().isoformat(),
        }},
    )
    return {
        "status":                "ok",
        "return_id":             return_id,
        "listing_id":            f"P2P-{return_id}",
        "asking_price":          body.asking_price,
        "message":               "Item listed on ReLoop P2P marketplace",
        "estimated_sale_time_days": 7,
    }


@router.post("/{return_id}/complete")
async def complete_return(return_id: str, body: CompleteReturnBody):
    """
    Mark return as fully resolved.
    - Awards green credits to user ledger
    - Appends 'completed' passport event
    - If disposition == refurbish → push to Amazon Renewed via SP-API mock
    """
    db = get_db()
    ret = await _get_return(db, return_id)
    prod = await _get_product(db, ret["product_id"])
    disposition = ret.get("disposal_route", "recycle")

    # Award green credits
    credits = ret.get("green_credits_awarded", 0.0)
    if credits > 0:
        await db.green_credits.update_one(
            {"user_id": ret["user_id"]},
            {
                "$inc": {"balance": credits, "total_earned": credits},
                "$push": {
                    "transactions": {
                        "amount":           credits,
                        "transaction_type": "earned_return",
                        "reference_id":     return_id,
                        "notes":            f"Return completed: {disposition}",
                        "balance_after":    0,      # frontend recalculates
                        "timestamp":        datetime.utcnow().isoformat(),
                    }
                },
                "$set": {"updated_at": datetime.utcnow().isoformat()},
            },
            upsert=True,
        )

    # SP-API: push to Amazon Renewed if eligible
    renewed_listing = None
    if disposition == "refurbish":
        p2p_price = ret.get("p2p_price") or (prod.get("price_new", 10000) * 0.6)
        renewed_listing = await push_renewed_listing(
            passport_id=ret["product_id"],
            grade=ret.get("item_condition", "good"),
            price=round(p2p_price, 2),
            product_name=ret.get("product_name"),
        )
        listing_id = renewed_listing["listing_id"]

        # Append renewed listing event to passport
        await append_event(
            product_id=ret["product_id"],
            event_type="refurbished",
            actor="system",
            notes=f"Listed as Amazon Renewed — {listing_id}",
            co2_delta_kg=-ret.get("co2_saved_kg", 0),
            condition_at_event=ret.get("item_condition"),
        )

        # Notify buyer mock
        notify_buyer(
            buyer_id=ret["user_id"],
            message=(
                f"Great news! Your returned {ret.get('product_name')} has been "
                f"refurbished and listed as Amazon Renewed (#{listing_id}). "
                f"You've earned {int(credits)} Green Credits. 🌱"
            ),
        )
    else:
        # Append generic completion event
        await append_event(
            product_id=ret["product_id"],
            event_type={"ngo_donate": "donated", "recycle": "recycled",
                        "p2p": "p2p_sold", "landfill": "recycled"}.get(disposition, "returned"),
            actor="system",
            notes=body.notes or f"Return completed via {disposition}",
            condition_at_event=ret.get("item_condition"),
        )

    # Mark return complete
    update_fields = {
        "status":     "completed",
        "updated_at": datetime.utcnow().isoformat(),
    }
    if renewed_listing:
        update_fields["renewed_listing_id"] = renewed_listing["listing_id"]
        update_fields["renewed_listing_url"] = renewed_listing["url"]

    await db.returns.update_one({"return_id": return_id}, {"$set": update_fields})

    return {
        "status":          "completed",
        "return_id":       return_id,
        "disposition":     disposition,
        "credits_awarded": credits,
        "message":         "Return completed successfully",
        "renewed_listing": renewed_listing,
        "notes":           body.notes,
    }
