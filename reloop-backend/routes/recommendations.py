"""
routes/recommendations.py — Demand-matched buyer targeting + similar refurbished items.
"""

import random
from fastapi import APIRouter
from database import get_db

router = APIRouter()

# Mock buyer intent signals (in prod, this would query a user-activity service)
MOCK_BUYER_SIGNALS = {
    "prod_samsung_m34_001": {
        "wishlist_count":    42,
        "cart_count":        18,
        "recent_search_count": 87,
        "similar_purchased": 34,
        "matched_buyers":    23,
        "avg_offer_price":   12500.0,
    },
    "prod_dell_xps15_001": {
        "wishlist_count":    15,
        "cart_count":         6,
        "recent_search_count": 41,
        "similar_purchased": 12,
        "matched_buyers":     9,
        "avg_offer_price":   89000.0,
    },
    "prod_levis_jacket_001": {
        "wishlist_count":    28,
        "cart_count":        11,
        "recent_search_count": 55,
        "similar_purchased": 19,
        "matched_buyers":    14,
        "avg_offer_price":    2800.0,
    },
    "prod_philips_blender_001": {
        "wishlist_count":    10,
        "cart_count":         4,
        "recent_search_count": 22,
        "similar_purchased":  8,
        "matched_buyers":     6,
        "avg_offer_price":    2200.0,
    },
    "prod_atomic_habits_001": {
        "wishlist_count":     8,
        "cart_count":          3,
        "recent_search_count": 19,
        "similar_purchased":   5,
        "matched_buyers":      4,
        "avg_offer_price":     250.0,
    },
}

DEFAULT_SIGNALS = {
    "wishlist_count":    5,
    "cart_count":        2,
    "recent_search_count": 10,
    "similar_purchased": 3,
    "matched_buyers":    3,
    "avg_offer_price":   0.0,
}


@router.get("/buyer-demand/{product_id}")
async def get_buyer_demand(product_id: str):
    """
    Returns demand signals and matched buyer count for a product.
    Used in Step 5/6 of return flow to show P2P potential.
    """
    signals = MOCK_BUYER_SIGNALS.get(product_id, DEFAULT_SIGNALS)

    return {
        "status":      "ok",
        "product_id":  product_id,
        "signals":     signals,
        "demand_tier": (
            "high"   if signals["matched_buyers"] >= 15 else
            "medium" if signals["matched_buyers"] >= 7  else
            "low"
        ),
        "notification_preview": (
            f"🔔 {signals['matched_buyers']} buyers are waiting for a refurbished version of this product. "
            f"They will receive an instant notification when your P2P listing goes live."
        ),
    }


@router.get("/similar/{product_id}")
async def get_similar_refurbished(product_id: str):
    """
    Returns similar refurbished items available in the ReLoop marketplace.
    """
    db = get_db()

    # Fetch the reference product
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        return {"status": "ok", "product_id": product_id, "similar": []}

    category = product.get("category", "electronics")

    # Find products in same category (exclude the queried one)
    cursor = db.products.find(
        {"category": category, "product_id": {"$ne": product_id}},
        {"_id": 0}
    ).limit(3)
    similar_products = await cursor.to_list(length=3)

    similar = []
    for p in similar_products:
        signals = MOCK_BUYER_SIGNALS.get(p["product_id"], DEFAULT_SIGNALS)
        similar.append({
            "product_id":    p["product_id"],
            "name":          p["name"],
            "brand":         p["brand"],
            "category":      p["category"],
            "image_url":     p.get("image_url", ""),
            "price_new":     p.get("price_new", 0),
            "price_renewed": round(p.get("price_new", 0) * 0.55, 0),
            "grade":         "Good",
            "carbon_saved":  round(p.get("carbon_footprint_kg", 20) * 0.60, 1),
            "matched_buyers": signals["matched_buyers"],
        })

    return {
        "status":     "ok",
        "product_id": product_id,
        "category":   category,
        "similar":    similar,
    }


@router.get("/for/{user_id}")
async def get_personalised_feed(user_id: str):
    """
    Returns a personalised feed of refurbished products matching user history.
    """
    db = get_db()

    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    past_categories = set()
    if user:
        for ret in user.get("past_returns", []):
            past_categories.add(ret.get("category", ""))

    # If no history, return everything
    query = {}
    if past_categories:
        query = {"category": {"$in": list(past_categories)}}

    cursor = db.products.find(query, {"_id": 0}).limit(4)
    products = await cursor.to_list(length=4)

    feed = []
    for p in products:
        signals = MOCK_BUYER_SIGNALS.get(p["product_id"], DEFAULT_SIGNALS)
        feed.append({
            "product_id":     p["product_id"],
            "name":           p["name"],
            "brand":          p["brand"],
            "category":       p["category"],
            "image_url":      p.get("image_url", ""),
            "price_new":      p.get("price_new", 0),
            "price_renewed":  round(p.get("price_new", 0) * 0.55, 0),
            "grade":          "Good",
            "carbon_saved":   round(p.get("carbon_footprint_kg", 20) * 0.60, 1),
            "match_reason":   f"Based on your past {p.get('category')} purchases",
            "discount_pct":   45,
        })

    return {
        "status":   "ok",
        "user_id":  user_id,
        "feed":     feed,
        "matched_categories": list(past_categories),
    }
