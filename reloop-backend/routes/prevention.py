"""
routes/prevention.py
Return prevention endpoint — AI-powered nudge before customer confirms return.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/{user_id}/{product_id}")
async def get_prevention_nudge(user_id: str, product_id: str):
    """
    Returns AI-generated content to help prevent an unnecessary return.
    Includes: fix tips, resale value, environmental impact of returning,
    and comparison to what keeping the item saves.
    """
    return {
        "status": "ok",
        "mock": True,
        "user_id": user_id,
        "product_id": product_id,
        "product_name": "Samsung Galaxy M34 5G",
        "should_prevent": True,
        "prevention_score": 72,        # 0–100, higher = stronger case to keep
        "nudge_message": (
            "Before you return — did you know this phone can be fixed cheaply? "
            "Most 'battery drains fast' issues are solved with a ₹299 battery calibration."
        ),
        "quick_fixes": [
            "Charge to 100% then drain completely once to recalibrate battery",
            "Turn off background apps in Settings → Battery",
            "Disable 5G when not needed — saves 30% battery",
        ],
        "resale_value_estimate": 12500.0,
        "co2_cost_of_return_kg": 4.2,
        "green_credits_if_kept": 50.0,
        "green_credits_if_returned": 120.0,
        "recommendation": "keep_and_fix",   # keep_and_fix | keep_and_resell | return_ok
    }
