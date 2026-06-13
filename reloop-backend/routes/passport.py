"""
routes/passport.py — wired to passport_service.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.passport_service import append_event, get_passport_display, create_passport

router = APIRouter()


class AddEventBody(BaseModel):
    event_type: str
    actor: str
    notes: Optional[str] = None
    location: Optional[str] = None
    co2_delta_kg: Optional[float] = None
    condition_at_event: Optional[str] = None


@router.get("/{product_id}")
async def get_passport(product_id: str):
    """Get the full lifecycle passport for a product."""
    passport = await get_passport_display(product_id)
    if not passport:
        raise HTTPException(status_code=404, detail=f"Passport not found for product: {product_id}")
    return {"status": "ok", **passport}


@router.post("/{product_id}/event")
async def add_passport_event(product_id: str, body: AddEventBody):
    """Append an immutable lifecycle event to a product's passport."""
    event = await append_event(
        product_id=product_id,
        event_type=body.event_type,
        actor=body.actor,
        notes=body.notes,
        location=body.location,
        co2_delta_kg=body.co2_delta_kg,
        condition_at_event=body.condition_at_event,
    )
    return {
        "status":      "ok",
        "product_id":  product_id,
        "event_added": event,
        "message":     "Lifecycle event appended to passport",
    }
