"""
routes/credits.py
Green credits ledger endpoints.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/{user_id}")
async def get_credits(user_id: str):
    """Get green credit balance and transaction history for a user."""
    return {
        "status": "ok",
        "mock": True,
        "user_id": user_id,
        "balance": 240.0,
        "total_earned": 340.0,
        "total_spent": 100.0,
        "transactions": [
            {
                "amount": 120.0,
                "transaction_type": "earned_return",
                "reference_id": "RET-20240613-0001",
                "notes": "Refurbished Samsung Galaxy M34 5G",
                "balance_after": 240.0,
                "timestamp": "2024-06-13T11:30:00",
            },
            {
                "amount": -100.0,
                "transaction_type": "spent_discount",
                "reference_id": "ORD-20240610-0042",
                "notes": "₹100 discount on next order",
                "balance_after": 120.0,
                "timestamp": "2024-06-10T09:00:00",
            },
            {
                "amount": 220.0,
                "transaction_type": "earned_return",
                "reference_id": "RET-20240530-0005",
                "notes": "Donated Zara shirt to Clothes Forward NGO",
                "balance_after": 220.0,
                "timestamp": "2024-05-30T14:00:00",
            },
        ],
    }
