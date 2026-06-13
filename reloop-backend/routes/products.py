"""
routes/products.py — returns real product data from MongoDB.
"""

from fastapi import APIRouter, HTTPException
from database import get_db

router = APIRouter()


@router.get("")
async def list_products(category: str = None, limit: int = 20):
    """List all products, optionally filtered by category."""
    db = get_db()
    query = {"category": category} if category else {}
    cursor = db.products.find(query, {"_id": 0}).limit(limit)
    products = await cursor.to_list(length=limit)
    return {"status": "ok", "count": len(products), "products": products}


@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a single product by product_id."""
    db = get_db()
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return {"status": "ok", "product": product}
