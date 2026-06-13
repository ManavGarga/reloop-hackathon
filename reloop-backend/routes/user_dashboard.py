"""
routes/user_dashboard.py
User dashboard aggregation endpoint — all data for the home screen in one call.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/{user_id}/dashboard")
async def get_user_dashboard(user_id: str):
    """Returns everything the frontend needs to render the user dashboard."""
    return {
        "status": "ok",
        "mock": True,
        "user_id": user_id,
        "user": {
            "name": "Priya Sharma",
            "city": "Bengaluru",
            "member_since": "2024-04-14",
        },
        "impact": {
            "co2_saved_kg": 28.4,
            "trees_equivalent": 1.4,
            "returns_avoided": 1,
            "items_refurbished": 1,
            "items_donated": 1,
            "items_p2p": 1,
        },
        "green_credits": {
            "balance": 240.0,
            "total_earned": 340.0,
            "total_spent": 100.0,
        },
        "recent_returns": [
            {
                "return_id": "RET-20240613-0001",
                "product_name": "Samsung Galaxy M34 5G",
                "status": "disposed",
                "route": "refurbish",
                "credits_earned": 120.0,
                "date": "2024-06-13",
            },
            {
                "return_id": "RET-20240530-0005",
                "product_name": "Zara Formal Shirt",
                "status": "completed",
                "route": "ngo_donate",
                "credits_earned": 80.0,
                "date": "2024-05-30",
            },
        ],
        "leaderboard_rank": 42,
        "sustainability_score": 84,
    }
