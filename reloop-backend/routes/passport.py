"""
routes/passport.py
Lifecycle passport endpoints — product provenance & CO₂ tracking.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class AddEventBody(BaseModel):
    event_type: str          # manufactured | sold | returned | refurbished | p2p_sold | donated | recycled
    actor: str               # user_id, ngo_id, or "system"
    notes: Optional[str] = None
    location: Optional[str] = None
    co2_delta_kg: Optional[float] = None
    condition_at_event: Optional[str] = None


@router.get("/{product_id}")
async def get_passport(product_id: str):
    """Get the full lifecycle passport for a product."""
    return {
        "status": "ok",
        "mock": True,
        "product_id": product_id,
        "product_name": "Samsung Galaxy M34 5G",
        "category": "electronics",
        "total_co2_kg": 70.0,
        "current_owner": "user_priya_001",
        "current_condition": "good",
        "events": [
            {
                "event_type": "manufactured",
                "timestamp": "2024-01-01T00:00:00",
                "actor": "system",
                "notes": "Manufactured at Samsung Noida plant",
                "location": "Noida, UP",
                "co2_delta_kg": 70.0,
            },
            {
                "event_type": "sold",
                "timestamp": "2024-03-15T00:00:00",
                "actor": "user_priya_001",
                "notes": "Original purchase via Amazon",
                "location": "Bengaluru, KA",
                "co2_delta_kg": 0.0,
            },
        ],
    }


@router.post("/{product_id}/event")
async def add_passport_event(product_id: str, body: AddEventBody):
    """Append a new lifecycle event to a product's passport."""
    return {
        "status": "ok",
        "mock": True,
        "product_id": product_id,
        "event_added": body.model_dump(),
        "message": "Lifecycle event appended to passport",
    }
