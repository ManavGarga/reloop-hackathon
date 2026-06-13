"""
routes/prevention.py — rule engine for return prevention nudges.
Fetches product data from DB; generates fix tips by category + reason.
"""

from fastapi import APIRouter
from database import get_db

router = APIRouter()

# ── Fix tips by category + common reason keywords ──────────────────────────────
FIX_TIPS = {
    "electronics": {
        "battery":  [
            "Charge to 100% then drain to 0% once to recalibrate battery",
            "Turn off Background App Refresh in Settings",
            "Disable 5G when not needed — saves up to 30% battery",
        ],
        "heating":  [
            "Remove case while charging — cases trap heat",
            "Lower screen brightness to 60% when indoors",
            "Close apps running in background",
        ],
        "screen":   [
            "Clean screen with microfibre cloth (not tissue)",
            "Check display settings — reduce blue light filter",
            "A screen protector replacement costs ₹199 and hides micro-scratches",
        ],
        "default":  [
            "Most issues are resolved by a factory reset (backup first)",
            "Visit nearest service centre — often free under warranty",
            "Check manufacturer's online troubleshooting guide",
        ],
    },
    "clothing": {
        "size":     [
            "Try layering — a size up can work with the right inner wear",
            "Many tailors can adjust waistband/hem for ₹150–300",
            "Gift to a friend or list on ReLoop P2P for quick cash",
        ],
        "colour":   [
            "Colours appear differently on screens — try in natural light",
            "Fabric dye kits can change the colour entirely for ₹199",
            "Consider keeping for casual/home use",
        ],
        "quality":  [
            "A good wash and fabric conditioner can revive most fabrics",
            "Iron inside-out to restore shape",
        ],
        "default":  [
            "Check if the issue is wash-related before returning",
            "ReLoop P2P lets you resell and recover up to 60% of cost",
        ],
    },
    "books": {
        "default":  [
            "Even a pre-read book in good condition sells well on P2P",
            "Donate to a local library or school — earns 80 Green Credits",
        ],
    },
    "appliances": {
        "noise":    [
            "Most motor noise reduces after 2–3 uses (break-in period)",
            "Ensure the appliance is on a flat, stable surface",
        ],
        "leaking":  [
            "Check rubber seals — replacements cost ₹50–100 online",
            "Ensure jar/bowl is correctly locked before use",
        ],
        "default":  [
            "Most appliance issues are covered under warranty — call manufacturer",
            "Cleaning the filter or heating element often resolves performance issues",
        ],
    },
}


def _get_tips(category: str, reason: str) -> list[str]:
    reason_lower = reason.lower()
    cat_tips = FIX_TIPS.get(category, FIX_TIPS.get("electronics", {}))
    for keyword, tips in cat_tips.items():
        if keyword != "default" and keyword in reason_lower:
            return tips
    return cat_tips.get("default", ["Consider listing on ReLoop P2P to recover value."])


def _prevention_score(grade_score: float, return_rate: float, reason: str) -> int:
    """
    Score 0–100: higher = stronger case to KEEP the item.
    """
    score = 50
    # High grade → item is in good shape → keep it
    score += int((grade_score - 50) * 0.4)
    # Low product return rate → item is reliable
    if return_rate < 10:
        score += 15
    elif return_rate > 20:
        score -= 10
    # Functional issues → allow return; cosmetic → nudge to keep
    functional_keywords = ["defective", "broken", "not working", "dead", "burnt"]
    if any(kw in reason.lower() for kw in functional_keywords):
        score -= 20
    cosmetic_keywords = ["size", "colour", "color", "look", "photo", "image"]
    if any(kw in reason.lower() for kw in cosmetic_keywords):
        score += 15
    return max(10, min(95, score))


@router.get("/{user_id}/{product_id}")
async def get_prevention_nudge(user_id: str, product_id: str, return_reason: str = ""):
    """
    Rule engine: should we try to prevent this return?
    Pass ?return_reason=battery+drains+fast as a query param.
    """
    db = get_db()

    # Fetch product
    prod = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not prod:
        prod = {
            "name": "Your item", "category": "general",
            "price_new": 10000, "return_rate_percent": 15,
            "carbon_footprint_kg": 20,
        }

    reason = return_reason or "general issue"
    category = prod.get("category", "general")
    price_new = prod.get("price_new", 10000)
    return_rate = prod.get("return_rate_percent", 15)
    carbon_kg = prod.get("carbon_footprint_kg", 20)

    # Use 75 as assumed grade if not yet graded (not called grade yet)
    assumed_grade = 75.0
    prev_score = _prevention_score(assumed_grade, return_rate, reason)
    should_prevent = prev_score >= 55

    tips = _get_tips(category, reason)
    resale_value = round(price_new * 0.55, 2)
    co2_cost = round(carbon_kg * 0.05, 2)      # transport + processing cost of a return
    credits_if_kept    = 50.0
    credits_if_returned = 120.0

    rec = "keep_and_fix" if should_prevent else "return_ok"
    if "size" in reason.lower() or "colour" in reason.lower():
        rec = "keep_and_resell"

    return {
        "status":            "ok",
        "user_id":           user_id,
        "product_id":        product_id,
        "product_name":      prod.get("name"),
        "should_prevent":    should_prevent,
        "prevention_score":  prev_score,
        "nudge_message": (
            f"Before you return — your {prod.get('name')} might be fixable! "
            f"Returning it adds {co2_cost} kg CO₂ to the atmosphere."
        ) if should_prevent else (
            f"We understand. We'll make sure your {prod.get('name')} finds "
            f"a sustainable second life through ReLoop."
        ),
        "quick_fixes":           tips,
        "resale_value_estimate": resale_value,
        "co2_cost_of_return_kg": co2_cost,
        "green_credits_if_kept": credits_if_kept,
        "green_credits_if_returned": credits_if_returned,
        "recommendation":        rec,
    }
