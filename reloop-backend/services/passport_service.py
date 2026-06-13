"""
services/passport_service.py
Lifecycle passport CRUD — immutable append-only event log.
Calculates trust_score and lives_count dynamically.
"""

import logging
from datetime import datetime
from typing import Optional
from database import get_db

logger = logging.getLogger(__name__)

# Events that indicate a new "life" for the product
LIFE_EVENTS = {"p2p_sold", "donated", "refurbished"}

# CO₂ impact per event type (signed; negative = saved)
CO2_IMPACT = {
    "manufactured":  1.0,    # multiplied by base footprint in caller
    "sold":          0.0,
    "returned":     -0.05,   # small transport cost
    "refurbished":  -0.70,   # replaces need for new item
    "p2p_sold":     -0.60,
    "donated":      -0.50,
    "recycled":     -0.25,
    "repaired":     -0.10,
}


def _calculate_trust_score(events: list[dict]) -> int:
    """
    Score 0–100 representing how sustainably managed this product has been.
    Starts at 70; each event adjusts it.
    """
    score = 70
    for evt in events:
        t = evt.get("event_type", "")
        if t in ("refurbished", "donated"):
            score += 10
        elif t == "p2p_sold":
            score += 7
        elif t == "recycled":
            score += 5
        elif t == "repaired":
            score += 3
        elif t == "returned":
            score -= 3
    return max(0, min(100, score))


def _count_lives(events: list[dict]) -> int:
    """Count how many times the product got a new owner / life."""
    return sum(1 for e in events if e.get("event_type") in LIFE_EVENTS)


# ── Public API ────────────────────────────────────────────────────────────────

async def create_passport(
    product_id: str,
    product_name: str,
    category: str,
    initial_co2_kg: float = 0.0,
    owner: Optional[str] = None,
) -> dict:
    """Create a new lifecycle passport. Upserts (safe to call multiple times)."""
    db = get_db()
    now = datetime.utcnow().isoformat()

    doc = {
        "product_id":        product_id,
        "product_name":      product_name,
        "category":          category,
        "total_co2_kg":      initial_co2_kg,
        "current_owner":     owner,
        "current_condition": "like_new",
        "events": [
            {
                "event_type":       "manufactured",
                "timestamp":        now,
                "actor":            "system",
                "notes":            "Product registered in ReLoop",
                "co2_delta_kg":     initial_co2_kg,
                "condition_at_event": "like_new",
            }
        ],
        "created_at": now,
        "updated_at": now,
    }

    await db.passports.update_one(
        {"product_id": product_id},
        {"$setOnInsert": doc},
        upsert=True,
    )
    return doc


async def append_event(
    product_id: str,
    event_type: str,
    actor: str,
    notes: Optional[str] = None,
    location: Optional[str] = None,
    co2_delta_kg: Optional[float] = None,
    condition_at_event: Optional[str] = None,
) -> dict:
    """Append a new immutable event to the passport."""
    db = get_db()
    now = datetime.utcnow().isoformat()

    event = {
        "event_type":        event_type,
        "timestamp":         now,
        "actor":             actor,
        "notes":             notes,
        "location":          location,
        "co2_delta_kg":      co2_delta_kg,
        "condition_at_event": condition_at_event,
    }
    # Remove None values
    event = {k: v for k, v in event.items() if v is not None}

    update = {
        "$push":  {"events": event},
        "$set":   {"updated_at": now},
    }
    if co2_delta_kg is not None:
        update["$inc"] = {"total_co2_kg": co2_delta_kg}

    # Ensure passport exists before appending
    passport = await db.passports.find_one({"product_id": product_id})
    if not passport:
        prod = await db.products.find_one({"product_id": product_id})
        prod_name = prod.get("name", "Product") if prod else "Product"
        category = prod.get("category", "general") if prod else "general"
        initial_co2 = prod.get("carbon_footprint_kg", 0.0) if prod else 0.0
        await create_passport(
            product_id=product_id,
            product_name=prod_name,
            category=category,
            initial_co2_kg=initial_co2
        )

    await db.passports.update_one({"product_id": product_id}, update)
    return event


async def get_passport_display(product_id: str) -> Optional[dict]:
    """
    Fetch passport and enrich with trust_score and lives_count.
    Returns None if passport not found.
    """
    db = get_db()
    doc = await db.passports.find_one({"product_id": product_id}, {"_id": 0})
    if not doc:
        return None

    events = doc.get("events", [])
    doc["trust_score"] = _calculate_trust_score(events)
    doc["lives_count"] = _count_lives(events)
    doc["event_count"] = len(events)

    return doc
