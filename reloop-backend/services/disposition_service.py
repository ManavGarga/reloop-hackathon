"""
services/disposition_service.py
Full decision matrix — determines best sustainable fate for a returned item.
Returns: disposition, estimated_resale_value, p2p_offer_price, refund_amount.
"""

from typing import Optional

# ── Disposition descriptions ──────────────────────────────────────────────────
DISPOSITION_META = {
    "refurbish": {
        "label":       "Refurbish & Resell as Amazon Renewed",
        "description": "Item will be professionally refurbished and listed as Amazon Renewed.",
        "icon":        "🔧",
    },
    "p2p": {
        "label":       "Peer-to-Peer Resale",
        "description": "Item listed on ReLoop marketplace for direct customer-to-customer resale.",
        "icon":        "🤝",
    },
    "ngo_donate": {
        "label":       "Donate to NGO Partner",
        "description": "Item donated to a verified NGO for community use.",
        "icon":        "💚",
    },
    "recycle": {
        "label":       "Responsible Recycling",
        "description": "Item disassembled for raw material recovery.",
        "icon":        "♻️",
    },
    "landfill": {
        "label":       "Controlled Disposal",
        "description": "Item is too damaged for any reuse; disposed of responsibly.",
        "icon":        "🗑️",
    },
}

# ── Green credit awards by disposition ───────────────────────────────────────
CREDITS_BY_DISPOSITION = {
    "refurbish":  150.0,
    "p2p":        100.0,
    "ngo_donate":  80.0,
    "recycle":     30.0,
    "landfill":     5.0,
}

# ── Resale value multipliers by condition ─────────────────────────────────────
RESALE_MULTIPLIERS = {
    "like_new": 0.70,
    "good":     0.50,
    "fair":     0.30,
    "poor":     0.10,
    "damaged":  0.02,
}


def _high_value_category(category: str) -> bool:
    return category in ("electronics", "appliances")


def get_disposition(
    grade_score: float,
    condition: str,
    category: str,
    price_new: float,
    return_reason: str,
) -> dict:
    """
    Full decision matrix — returns the best disposal route plus financial estimates.

    Matrix logic:
      ≥ 88  → like_new  → electronics/appliances: refurbish | others: p2p
      72–87 → good      → p2p for all
      52–71 → fair      → clothing/books: ngo_donate | electronics: p2p | others: ngo_donate
      30–51 → poor      → recycle (unless clothing → ngo_donate)
       < 30 → damaged   → landfill
    """

    # Override for specific return reasons regardless of grade
    reason_lower = return_reason.lower()
    forced = None
    if "size" in reason_lower or "colour" in reason_lower or "color" in reason_lower:
        # Perfectly functional — just wrong size / colour
        if grade_score >= 52:
            forced = "p2p" if grade_score >= 72 else "ngo_donate"

    if forced:
        disposition = forced
    elif grade_score >= 88:
        disposition = "refurbish" if _high_value_category(category) else "p2p"
    elif grade_score >= 72:
        disposition = "p2p"
    elif grade_score >= 52:
        if category in ("clothing", "books"):
            disposition = "ngo_donate"
        elif category == "electronics":
            disposition = "p2p"
        else:
            disposition = "ngo_donate"
    elif grade_score >= 30:
        disposition = "ngo_donate" if category == "clothing" else "recycle"
    else:
        disposition = "landfill"

    # ── Financial estimates ─────────────────────────────────────────────────
    resale_mult = RESALE_MULTIPLIERS.get(condition, 0.0)
    estimated_resale_value = round(price_new * resale_mult, 2)

    # P2P offer: 8% above resale so seller has negotiation room
    p2p_offer_price = round(estimated_resale_value * 1.08, 2) if disposition in ("p2p", "refurbish") else 0.0

    # Refund: grade-proportional; like_new = full, damaged = 10%
    refund_pct = max(0.10, grade_score / 100)
    refund_amount = round(price_new * refund_pct, 2)

    green_credits = CREDITS_BY_DISPOSITION.get(disposition, 0.0)
    meta = DISPOSITION_META[disposition]

    return {
        "disposition":           disposition,
        "disposition_label":     meta["label"],
        "disposition_desc":      meta["description"],
        "disposition_icon":      meta["icon"],
        "estimated_resale_value": estimated_resale_value,
        "p2p_offer_price":       p2p_offer_price,
        "refund_amount":         refund_amount,
        "green_credits_awarded": green_credits,
    }
