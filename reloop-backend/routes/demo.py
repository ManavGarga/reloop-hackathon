"""
routes/demo.py — resets DB to clean seed state for hackathon presentations.
"""

from datetime import datetime
from fastapi import APIRouter
from database import get_db
from seed_data import PRODUCTS, USERS, NGOS, PASSPORTS, seed_if_empty

router = APIRouter()


@router.post("/reset")
async def demo_reset():
    """
    Drops all collections and re-seeds with fresh demo data.
    USE ONLY during demo / hackathon presentations.
    """
    db = get_db()

    collections = [
        "products", "users", "ngos", "passports",
        "returns", "green_credits", "credit_transactions",
    ]
    for col in collections:
        await db[col].drop()

    await seed_if_empty()

    return {
        "status":  "ok",
        "message": "🔄 Demo DB reset — all collections cleared and re-seeded",
        "seeded": {
            "products":  len(PRODUCTS),
            "users":     len(USERS),
            "ngos":      len(NGOS),
            "passports": len(PASSPORTS),
        },
        "timestamp": datetime.utcnow().isoformat(),
    }
