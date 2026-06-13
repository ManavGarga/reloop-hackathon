"""
routes/returns.py
All return-flow endpoints.
Currently returning hardcoded mock responses — Phase 2 will wire real logic.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


# ── Request bodies ──────────────────────────────────────────────

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
    disposal_route: str                 # refurbish | p2p | ngo_donate | recycle | landfill
    ngo_id: Optional[str] = None
    p2p_price: Optional[float] = None


class P2PListBody(BaseModel):
    asking_price: float
    description: Optional[str] = None


class CompleteReturnBody(BaseModel):
    notes: Optional[str] = None


# ── Endpoints ───────────────────────────────────────────────────

@router.post("/initiate")
async def initiate_return(body: InitiateReturnBody):
    """Step 1: Customer initiates a return."""
    return {
        "status": "ok",
        "mock": True,
        "return_id": "RET-20240613-0001",
        "message": "Return initiated successfully",
        "next_step": "grade",
        "data": body.model_dump(),
    }


@router.post("/grade")
async def grade_return(body: GradeReturnBody):
    """Step 2: AI grades item condition from image/description."""
    return {
        "status": "ok",
        "mock": True,
        "return_id": body.return_id,
        "grade_score": 78.5,
        "condition": "good",
        "notes": "Minor scratches on back panel. Screen pristine. All functions working.",
        "recommended_route": "refurbish",
        "co2_saved_estimate_kg": 42.0,
        "green_credits_estimate": 120.0,
    }


@router.post("/dispose")
async def dispose_return(body: DisposeBody):
    """Step 3: Confirm disposal route and award green credits."""
    return {
        "status": "ok",
        "mock": True,
        "return_id": body.return_id,
        "disposal_route": body.disposal_route,
        "green_credits_awarded": 120.0,
        "co2_saved_kg": 42.0,
        "message": f"Item routed to '{body.disposal_route}' successfully",
    }


@router.get("/{return_id}")
async def get_return(return_id: str):
    """Get full details of a return request by ID."""
    return {
        "status": "ok",
        "mock": True,
        "return_id": return_id,
        "user_id": "user_priya_001",
        "product_name": "Samsung Galaxy M34 5G",
        "return_reason": "battery drains fast",
        "item_condition": "good",
        "ai_grade_score": 78.5,
        "disposal_route": "refurbish",
        "green_credits_awarded": 120.0,
        "co2_saved_kg": 42.0,
        "status_field": "disposed",
        "created_at": "2024-06-13T10:00:00",
        "updated_at": "2024-06-13T11:30:00",
    }


@router.post("/{return_id}/p2p")
async def list_p2p(return_id: str, body: P2PListBody):
    """List a returned item on peer-to-peer marketplace."""
    return {
        "status": "ok",
        "mock": True,
        "return_id": return_id,
        "listing_id": f"P2P-{return_id}",
        "asking_price": body.asking_price,
        "message": "Item listed on P2P marketplace",
        "estimated_sale_time_days": 7,
    }


@router.post("/{return_id}/complete")
async def complete_return(return_id: str, body: CompleteReturnBody):
    """Mark a return as fully resolved."""
    return {
        "status": "ok",
        "mock": True,
        "return_id": return_id,
        "message": "Return marked as completed",
        "notes": body.notes,
    }
