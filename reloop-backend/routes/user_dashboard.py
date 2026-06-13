"""
routes/user_dashboard.py — aggregates real data from MongoDB.
"""

from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/{user_id}/dashboard")
async def get_user_dashboard(user_id: str):
    """Aggregate dashboard data from MongoDB for the given user."""
    db = get_db()

    # Fetch user
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0}) or {}

    # Fetch green credits ledger
    ledger = await db.green_credits.find_one({"user_id": user_id}, {"_id": 0}) or {}

    # Fetch recent returns (last 10)
    cursor = db.returns.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1).limit(10)
    recent_returns = await cursor.to_list(length=10)

    # Impact aggregation
    co2_saved = sum(r.get("co2_saved_kg", 0) for r in recent_returns)
    items_refurbished = sum(1 for r in recent_returns if r.get("disposal_route") == "refurbish")
    items_donated     = sum(1 for r in recent_returns if r.get("disposal_route") == "ngo_donate")
    items_p2p         = sum(1 for r in recent_returns if r.get("disposal_route") == "p2p")
    returns_prevented = sum(1 for r in recent_returns if r.get("status") == "prevented")

    # If user has no returns yet, show seed data for demo
    if not recent_returns and user:
        co2_saved = user.get("co2_saved_kg", 0)

    trees_equiv = round(co2_saved / 21.0, 1)

    # Build cleaned recent returns list
    formatted_returns = [
        {
            "return_id":      r.get("return_id"),
            "product_id":     r.get("product_id"),
            "product_name":   r.get("product_name"),
            "status":         r.get("status"),
            "route":          r.get("disposal_route"),
            "grade":          r.get("grade"),
            "co2_saved":      r.get("co2_saved_kg"),
            "credits_earned": r.get("green_credits_awarded", 0),
            "date":           (r.get("created_at") or "")[:10],
        }
        for r in recent_returns
    ]

    return {
        "status":  "ok",
        "user_id": user_id,
        "user": {
            "name":         user.get("name", "User"),
            "email":        user.get("email", ""),
            "city":         user.get("city", ""),
            "member_since": (user.get("created_at") or "")[:10],
        },
        "impact": {
            "co2_saved_kg":     round(co2_saved, 2),
            "trees_equivalent": trees_equiv,
            "returns_avoided":  returns_prevented,
            "items_refurbished": items_refurbished,
            "items_donated":    items_donated,
            "items_p2p":        items_p2p,
            "total_returns":    len(recent_returns),
        },
        "green_credits": {
            "balance":      ledger.get("balance", 0),
            "total_earned": ledger.get("total_earned", 0),
            "total_spent":  ledger.get("total_spent", 0),
        },
        "recent_returns": formatted_returns,
        "leaderboard_rank":    42,     # TODO: compute from all users
        "sustainability_score": min(100, 50 + len(recent_returns) * 5 + int(trees_equiv * 2)),
    }
