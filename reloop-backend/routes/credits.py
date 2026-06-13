"""
routes/credits.py — Green credits ledger from MongoDB.
"""

from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/{user_id}")
async def get_credits(user_id: str):
    """Get green credit balance and transaction history for a user."""
    db = get_db()
    ledger = await db.green_credits.find_one({"user_id": user_id}, {"_id": 0}) or {}

    return {
        "status":       "ok",
        "user_id":      user_id,
        "balance":      ledger.get("balance", 0.0),
        "total_earned": ledger.get("total_earned", 0.0),
        "total_spent":  ledger.get("total_spent", 0.0),
        "transactions": ledger.get("transactions", []),
    }
