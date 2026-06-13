"""
seed_data.py — seeds MongoDB with demo data on first startup.
Safe to call on every restart: only inserts if collections are empty.
"""

from datetime import datetime, timedelta
from database import get_db


# ─────────────────────────────────────────────
#  RAW SEED DOCUMENTS
# ─────────────────────────────────────────────

PRODUCTS = [
    {
        "product_id": "prod_samsung_m34_001",
        "name": "Samsung Galaxy M34 5G",
        "category": "electronics",
        "brand": "Samsung",
        "price_new": 18999.0,
        "carbon_footprint_kg": 70.0,
        "return_rate_percent": 12.5,
        "common_return_reasons": [
            "battery drains fast",
            "heating issue",
            "screen flickering",
            "not as described",
        ],
        "image_url": "https://images.samsung.com/in/smartphones/galaxy-m34-5g/images/galaxy-m34-5g-silver.jpg",
        "description": "6000mAh battery, 120Hz Super AMOLED display, 50MP camera",
    },
    {
        "product_id": "prod_dell_xps15_001",
        "name": "Dell XPS 15 Laptop",
        "category": "electronics",
        "brand": "Dell",
        "price_new": 129990.0,
        "carbon_footprint_kg": 350.0,
        "return_rate_percent": 8.2,
        "common_return_reasons": [
            "keyboard issue",
            "battery not lasting",
            "overheating",
            "dead pixels",
        ],
        "image_url": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/general/ng/xps-9530-nt-blue-gallery-5.psd",
        "description": "Intel Core i7, 16GB RAM, OLED Touch display, RTX 4060",
    },
    {
        "product_id": "prod_atomic_habits_001",
        "name": "Atomic Habits — James Clear",
        "category": "books",
        "brand": "Penguin Random House",
        "price_new": 399.0,
        "carbon_footprint_kg": 1.2,
        "return_rate_percent": 3.5,
        "common_return_reasons": [
            "already own it",
            "wrong edition",
            "damaged cover",
        ],
        "image_url": "https://m.media-amazon.com/images/I/81wgcld4wxL._SL1500_.jpg",
        "description": "International bestseller on building good habits and breaking bad ones",
    },
    {
        "product_id": "prod_philips_blender_001",
        "name": "Philips HL7756 Blender",
        "category": "appliances",
        "brand": "Philips",
        "price_new": 3499.0,
        "carbon_footprint_kg": 18.5,
        "return_rate_percent": 15.0,
        "common_return_reasons": [
            "motor noise",
            "leaking jar",
            "blade not spinning",
            "defective on arrival",
        ],
        "image_url": "https://www.philips.co.in/c-dam/b2c/category-pages/kitchen/blenders/hl7756.jpg",
        "description": "600W motor, 1.5L jar, 3 speed settings with pulse",
    },
    {
        "product_id": "prod_levis_jacket_001",
        "name": "Levi's Trucker Denim Jacket",
        "category": "clothing",
        "brand": "Levi's",
        "price_new": 4299.0,
        "carbon_footprint_kg": 22.0,
        "return_rate_percent": 25.0,
        "common_return_reasons": [
            "size mismatch",
            "colour different from photo",
            "stitching issue",
            "fabric quality",
        ],
        "image_url": "https://lsco.scene7.com/is/image/lsco/723340001-front-pdp",
        "description": "Classic blue denim trucker jacket, slim fit, button front",
    },
]


USERS = [
    {
        "user_id": "user_priya_001",
        "name": "Priya Sharma",
        "email": "priya.sharma@example.com",
        "phone": "+91-9876543210",
        "city": "Bengaluru",
        "green_credits": {
            "total_earned": 340.0,
            "total_spent": 100.0,
            "balance": 240.0,
        },
        "total_returns": 3,
        "co2_saved_kg": 28.4,
        "created_at": (datetime.utcnow() - timedelta(days=60)).isoformat(),
        "past_returns": [
            {
                "product": "Nike Dri-FIT T-Shirt",
                "category": "clothing",
                "reason": "size mismatch",
                "route": "p2p",
                "date": (datetime.utcnow() - timedelta(days=55)).isoformat(),
            },
            {
                "product": "Boat Airdopes 141",
                "category": "electronics",
                "reason": "sound quality poor",
                "route": "refurbish",
                "date": (datetime.utcnow() - timedelta(days=30)).isoformat(),
            },
            {
                "product": "Zara Formal Shirt",
                "category": "clothing",
                "reason": "color different from photo",
                "route": "ngo_donate",
                "date": (datetime.utcnow() - timedelta(days=10)).isoformat(),
            },
        ],
    }
]


NGOS = [
    {
        "ngo_id": "ngo_digital_bridge_001",
        "name": "Digital Bridge Foundation",
        "description": "Refurbishes returned electronics and donates to underprivileged students",
        "category": "electronics",
        "city": "Bengaluru",
        "contact_email": "donate@digitalbridge.org",
        "contact_phone": "+91-8012345678",
        "website": "https://digitalbridge.org",
        "items_received": 412,
        "active": True,
        "created_at": (datetime.utcnow() - timedelta(days=365)).isoformat(),
    },
    {
        "ngo_id": "ngo_clothes_forward_002",
        "name": "Clothes Forward",
        "description": "Collects returned and pre-owned garments for rural communities",
        "category": "clothing",
        "city": "Mumbai",
        "contact_email": "hello@clothesforward.in",
        "contact_phone": "+91-9923456789",
        "website": "https://clothesforward.in",
        "items_received": 1870,
        "active": True,
        "created_at": (datetime.utcnow() - timedelta(days=200)).isoformat(),
    },
    {
        "ngo_id": "ngo_shelf_life_003",
        "name": "Shelf Life Books",
        "description": "Distributes returned books to government school libraries across India",
        "category": "books",
        "city": "Delhi",
        "contact_email": "books@shelflife.ngo",
        "contact_phone": "+91-9811234567",
        "website": "https://shelflife.ngo",
        "items_received": 3250,
        "active": True,
        "created_at": (datetime.utcnow() - timedelta(days=500)).isoformat(),
    },
]


PASSPORTS = [
    {
        "product_id": "prod_samsung_m34_001",
        "product_name": "Samsung Galaxy M34 5G",
        "category": "electronics",
        "total_co2_kg": 70.0,
        "current_owner": "user_priya_001",
        "current_condition": "good",
        "events": [
            {
                "event_type": "manufactured",
                "timestamp": (datetime.utcnow() - timedelta(days=180)).isoformat(),
                "actor": "system",
                "notes": "Manufactured at Samsung Noida plant",
                "location": "Noida, UP",
                "co2_delta_kg": 70.0,
                "condition_at_event": "like_new",
            },
            {
                "event_type": "sold",
                "timestamp": (datetime.utcnow() - timedelta(days=90)).isoformat(),
                "actor": "user_priya_001",
                "notes": "Original purchase via Amazon",
                "location": "Bengaluru, KA",
                "co2_delta_kg": 0.0,
                "condition_at_event": "like_new",
            },
        ],
        "created_at": (datetime.utcnow() - timedelta(days=180)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=90)).isoformat(),
    },
    {
        "product_id": "prod_levis_jacket_001",
        "product_name": "Levi's Trucker Denim Jacket",
        "category": "clothing",
        "total_co2_kg": 22.0,
        "current_owner": "ngo_clothes_forward_002",
        "current_condition": "good",
        "events": [
            {
                "event_type": "manufactured",
                "timestamp": (datetime.utcnow() - timedelta(days=300)).isoformat(),
                "actor": "system",
                "notes": "Manufactured in Bangladesh",
                "location": "Dhaka, Bangladesh",
                "co2_delta_kg": 22.0,
                "condition_at_event": "like_new",
            },
            {
                "event_type": "returned",
                "timestamp": (datetime.utcnow() - timedelta(days=10)).isoformat(),
                "actor": "user_priya_001",
                "notes": "Color mismatch — donated to NGO",
                "location": "Bengaluru, KA",
                "co2_delta_kg": -8.5,
                "condition_at_event": "good",
            },
        ],
        "created_at": (datetime.utcnow() - timedelta(days=300)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=10)).isoformat(),
    },
]


# ─────────────────────────────────────────────
#  SEEDER FUNCTION
# ─────────────────────────────────────────────

async def seed_if_empty():
    db = get_db()
    if db is None:
        print("⚠️  Seed skipped — DB not connected yet")
        return

    seeded: list[str] = []

    # Products
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many(PRODUCTS)
        seeded.append(f"{len(PRODUCTS)} products")

    # Users
    if await db.users.count_documents({}) == 0:
        await db.users.insert_many(USERS)
        seeded.append(f"{len(USERS)} users")

    # NGOs
    if await db.ngos.count_documents({}) == 0:
        await db.ngos.insert_many(NGOS)
        seeded.append(f"{len(NGOS)} NGOs")

    # Passports
    if await db.passports.count_documents({}) == 0:
        await db.passports.insert_many(PASSPORTS)
        seeded.append(f"{len(PASSPORTS)} passports")

    # Green credit ledgers (one per user)
    if await db.green_credits.count_documents({}) == 0:
        ledgers = [
            {
                "user_id": u["user_id"],
                "balance": u["green_credits"]["balance"],
                "total_earned": u["green_credits"]["total_earned"],
                "total_spent": u["green_credits"]["total_spent"],
                "transactions": [],
                "updated_at": datetime.utcnow().isoformat(),
            }
            for u in USERS
        ]
        await db.green_credits.insert_many(ledgers)
        seeded.append(f"{len(ledgers)} credit ledgers")

    if seeded:
        print(f"🌱 Seeded: {', '.join(seeded)}")
    else:
        print("✅ DB already seeded — skipping")
