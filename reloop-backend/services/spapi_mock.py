"""
services/spapi_mock.py
Mock Amazon SP-API integration layer.
Simulates what real SP-API would provide for a production integration.
All functions log their actions and return realistic mock responses.
"""

import logging
import random
import string
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)


def _random_suffix(n: int = 6) -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=n))


# ── SP-API Mock Functions ─────────────────────────────────────────────────────

def get_order_details(order_id: str) -> dict:
    """
    Simulate SP-API GetOrder endpoint.
    Returns mock order with ASIN, buyer_id, purchase_date.
    """
    logger.info(f"[SP-API Mock] GetOrder: {order_id}")

    # Deterministic buyer from order_id
    buyer_suffix = abs(hash(order_id)) % 90000 + 10000

    return {
        "order_id":      order_id,
        "asin":          f"B0{abs(hash(order_id)) % 9000000000:010d}"[:12],
        "buyer_id":      f"AMZ_BUYER_{buyer_suffix}",
        "purchase_date": (datetime.utcnow() - timedelta(days=14)).isoformat(),
        "order_status":  "Shipped",
        "marketplace":   "Amazon.in",
        "item_price":    round(random.uniform(500, 15000), 2),
        "currency":      "INR",
        "source":        "SP-API Mock v1.0",
    }


def get_return_request(return_id: str) -> dict:
    """
    Simulate SP-API ListReturnReasonCodes / GetReturn endpoint.
    Returns mock return with reason code and status.
    """
    logger.info(f"[SP-API Mock] GetReturnRequest: {return_id}")

    reason_codes = [
        ("DEFECTIVE",          "Item is defective or doesn't work"),
        ("WRONG_ITEM",         "Wrong item was sent"),
        ("NOT_AS_DESCRIBED",   "Item not as described on website"),
        ("CHANGED_MIND",       "Buyer changed their mind"),
        ("BETTER_PRICE",       "Found a better price elsewhere"),
        ("SIZE_ISSUE",         "Size or fit issue"),
    ]
    code, desc = reason_codes[abs(hash(return_id)) % len(reason_codes)]

    return {
        "return_id":       return_id,
        "reason_code":     code,
        "reason_desc":     desc,
        "return_status":   "ReturnReceived",
        "marketplace":     "Amazon.in",
        "received_date":   datetime.utcnow().isoformat(),
        "source":          "SP-API Mock v1.0",
    }


async def push_renewed_listing(
    passport_id: str,
    grade: str,
    price: float,
    product_name: Optional[str] = None,
) -> dict:
    """
    Simulate pushing a refurbished item to Amazon Renewed marketplace.
    In production: calls SP-API Listings API with Renewed condition type.
    Returns listing_id and mock URL.
    """
    listing_id = f"AMZ-RENEWED-{_random_suffix(8)}"
    asin_mock = f"B0{abs(hash(passport_id)) % 9000000000:010d}"[:12]

    logger.info(
        f"[SP-API Mock] PushRenewedListing: passport={passport_id} "
        f"grade={grade} price=₹{price} → listing_id={listing_id}"
    )

    return {
        "listing_id":   listing_id,
        "asin":         asin_mock,
        "title":        f"{product_name or 'Renewed Item'} — Amazon Renewed ({grade.title()})",
        "price":        price,
        "currency":     "INR",
        "condition":    "Renewed",
        "grade":        grade,
        "url":          f"https://www.amazon.in/dp/{asin_mock}?th=1&psc=1",
        "status":       "ACTIVE",
        "listed_at":    datetime.utcnow().isoformat(),
        "source":       "SP-API Mock v1.0",
    }


def notify_buyer(buyer_id: str, message: str, channel: str = "email") -> dict:
    """
    Simulate sending a notification to the buyer.
    In production: calls SP-API Messaging API.
    """
    logger.info(
        f"[SP-API Mock] NotifyBuyer: buyer={buyer_id} channel={channel} "
        f"message='{message[:60]}...'"
    )
    return {
        "sent":       True,
        "buyer_id":   buyer_id,
        "channel":    channel,
        "message":    message,
        "sent_at":    datetime.utcnow().isoformat(),
        "message_id": f"MSG-{_random_suffix(10)}",
        "source":     "SP-API Mock v1.0",
    }
