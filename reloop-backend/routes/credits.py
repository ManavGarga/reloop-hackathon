"""
routes/credits.py — Green credits ledger + redemption from MongoDB.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db

router = APIRouter()

# ── Reward catalogue ──────────────────────────────────────────────────────────
REWARD_CATALOGUE = {
    "amazon_50":    {"title": "₹50 Amazon Discount", "credits": 100, "value": 50,   "type": "discount"},
    "amazon_100":   {"title": "₹100 Amazon Discount","credits": 200, "value": 100,  "type": "discount"},
    "amazon_250":   {"title": "₹250 Amazon Discount","credits": 500, "value": 250,  "type": "discount"},
    "ngo_plant":    {"title": "Plant a Tree via NGO", "credits": 50,  "value": 0,   "type": "ngo"},
    "priority_access": {"title": "Priority Renewed Access", "credits": 150, "value": 0, "type": "tier"},
}


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


class RedeemBody(BaseModel):
    reward_id: str


@router.post("/{user_id}/redeem")
async def redeem_credits(user_id: str, body: RedeemBody):
    """
    Redeem green credits for a reward from the catalogue.
    Deducts credits atomically and records transaction.
    """
    db = get_db()

    reward = REWARD_CATALOGUE.get(body.reward_id)
    if not reward:
        raise HTTPException(status_code=404, detail=f"Reward '{body.reward_id}' not found in catalogue")

    ledger = await db.green_credits.find_one({"user_id": user_id}, {"_id": 0})
    if not ledger:
        raise HTTPException(status_code=404, detail=f"No credit ledger found for user {user_id}")

    balance = ledger.get("balance", 0.0)
    if balance < reward["credits"]:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient credits. You have {balance} but need {reward['credits']}."
        )

    now = datetime.utcnow().isoformat()
    transaction = {
        "amount":           -reward["credits"],
        "transaction_type": "redeemed_reward",
        "reference_id":     body.reward_id,
        "notes":            f"Redeemed: {reward['title']}",
        "balance_after":    balance - reward["credits"],
        "timestamp":        now,
    }

    await db.green_credits.update_one(
        {"user_id": user_id},
        {
            "$inc":  {"balance": -reward["credits"], "total_spent": reward["credits"]},
            "$push": {"transactions": transaction},
            "$set":  {"updated_at": now},
        }
    )

    new_balance = balance - reward["credits"]

    return {
        "status":       "ok",
        "user_id":      user_id,
        "reward":       reward,
        "credits_used": reward["credits"],
        "new_balance":  new_balance,
        "transaction":  transaction,
        "coupon_code":  f"RELOOP-{body.reward_id.upper()}-{user_id[-4:].upper()}",
        "message":      f"Successfully redeemed {reward['credits']} credits for {reward['title']}!",
    }


class ConvertBody(BaseModel):
    amount: float


@router.post("/{user_id}/convert")
async def convert_credits(user_id: str, body: ConvertBody):
    """
    Convert green credits to Amazon Pay wallet balance.
    Deducts credits atomically from balance and pushes to ledger.
    """
    db = get_db()
    
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="Conversion amount must be positive")

    ledger = await db.green_credits.find_one({"user_id": user_id}, {"_id": 0})
    if not ledger:
        raise HTTPException(status_code=404, detail=f"No credit ledger found for user {user_id}")

    balance = ledger.get("balance", 0.0)
    if balance < body.amount:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient credits. You have {balance} but requested {body.amount}."
        )

    now = datetime.utcnow().isoformat()
    transaction = {
        "amount":           -body.amount,
        "transaction_type": "converted_wallet",
        "reference_id":     "wallet_conversion",
        "notes":            f"Converted {body.amount} credits to Amazon Pay balance",
        "balance_after":    balance - body.amount,
        "timestamp":        now,
    }

    await db.green_credits.update_one(
        {"user_id": user_id},
        {
            "$inc":  {"balance": -body.amount, "total_spent": body.amount},
            "$push": {"transactions": transaction},
            "$set":  {"updated_at": now},
        }
    )

    return {
        "status":       "ok",
        "user_id":      user_id,
        "converted":    body.amount,
        "new_balance":  balance - body.amount,
        "transaction":  transaction,
    }


@router.get("/catalogue/rewards")
async def get_reward_catalogue():
    """Return the full reward catalogue."""
    return {
        "status":  "ok",
        "rewards": [
            {"reward_id": k, **v}
            for k, v in REWARD_CATALOGUE.items()
        ]
    }
