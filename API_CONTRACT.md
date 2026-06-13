# ReLoop API Contract

> **This document is the source of truth for Person 2 (frontend).**  
> Field names are character-for-character exact. Do not guess or rename.  
> Base URL: `http://localhost:8000/api` (dev) · `https://<your-deploy>.vercel.app/api` (prod)  
> All timestamps are ISO-8601 strings: `"2026-06-13T10:00:00.000000"`  
> All monetary values are `float` in **INR**.  
> All CO₂ values are `float` in **kg**.

---

## Table of Contents

1. [Health](#1-health)
2. [Products](#2-products)
3. [Returns Flow](#3-returns-flow)
   - [Initiate](#31-post-apireturns initiate)
   - [Grade](#32-post-apireturngrade)
   - [Dispose](#33-post-apireturns dispose)
   - [Get Return](#34-get-apireturnsreturn_id)
   - [P2P List](#35-post-apireturnsreturn_idp2p)
   - [Complete](#36-post-apireturnsreturn_idcomplete)
4. [Passport](#4-passport)
5. [Credits](#5-credits)
6. [User Dashboard](#6-user-dashboard)
7. [Prevention](#7-prevention)
8. [Demo Reset](#8-demo-reset)
9. [Error Shape](#9-error-shape)
10. [Enum Reference](#10-enum-reference)

---

## 1. Health

### `GET /api/health`

**Response `200`**
```json
{
  "status": "ok",
  "project": "ReLoop"
}
```

---

## 2. Products

### `GET /api/products`

**Query params (all optional)**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Filter by category |
| `limit` | int | 20 | Max results |

**Response `200`**
```json
{
  "status": "ok",
  "count": 5,
  "products": [
    {
      "product_id": "prod_samsung_m34_001",
      "name": "Samsung Galaxy M34 5G",
      "category": "electronics",
      "brand": "Samsung",
      "price_new": 18999.0,
      "carbon_footprint_kg": 70.0,
      "return_rate_percent": 12.5,
      "common_return_reasons": ["battery drains fast", "heating issue"],
      "image_url": "https://...",
      "description": "6000mAh battery..."
    }
  ]
}
```

### `GET /api/products/{product_id}`

**Response `200`**
```json
{
  "status": "ok",
  "product": {
    "product_id": "prod_samsung_m34_001",
    "name": "Samsung Galaxy M34 5G",
    "category": "electronics",
    "brand": "Samsung",
    "price_new": 18999.0,
    "carbon_footprint_kg": 70.0,
    "return_rate_percent": 12.5,
    "common_return_reasons": ["battery drains fast", "heating issue"],
    "image_url": "https://...",
    "description": "6000mAh battery..."
  }
}
```

**Response `404`** — product not found → see [Error Shape](#9-error-shape)

---

## 3. Returns Flow

### 3.1 `POST /api/returns/initiate`

**Request Body**
```json
{
  "user_id": "user_priya_001",
  "product_id": "prod_samsung_m34_001",
  "product_name": "Samsung Galaxy M34 5G",
  "return_reason": "battery drains fast",
  "reason_detail": "Loses 30% charge overnight",
  "item_condition": "good",
  "image_url": "https://..."
}
```

| Field | Type | Required |
|-------|------|----------|
| `user_id` | string | ✅ |
| `product_id` | string | ✅ |
| `product_name` | string | ✅ |
| `return_reason` | string | ✅ |
| `reason_detail` | string | ❌ |
| `item_condition` | string | ❌ |
| `image_url` | string | ❌ |

**Response `200`**
```json
{
  "status": "ok",
  "return_id": "RET-20260613-4ACDE9",
  "message": "Return initiated successfully",
  "next_step": "grade",
  "data": {
    "return_id": "RET-20260613-4ACDE9",
    "user_id": "user_priya_001",
    "product_id": "prod_samsung_m34_001",
    "product_name": "Samsung Galaxy M34 5G",
    "return_reason": "battery drains fast",
    "reason_detail": "Loses 30% charge overnight",
    "item_condition": null,
    "image_url": "https://...",
    "status": "initiated",
    "created_at": "2026-06-13T10:00:00.000000",
    "updated_at": "2026-06-13T10:00:00.000000"
  }
}
```

> **Store `return_id`** — you need it for all subsequent calls.

---

### 3.2 `POST /api/returns/grade`

> ⚠️ This endpoint takes **~2.5 seconds** by design (AI grading simulation). Show a loading animation.

**Request Body**
```json
{
  "return_id": "RET-20260613-4ACDE9",
  "image_url": "https://...",
  "description": "Back panel has minor scratch"
}
```

| Field | Type | Required |
|-------|------|----------|
| `return_id` | string | ✅ |
| `image_url` | string | ❌ |
| `description` | string | ❌ |

**Response `200`**
```json
{
  "status": "ok",
  "return_id": "RET-20260613-4ACDE9",
  "grade_score": 61,
  "condition": "fair",
  "condition_label": "Fair",
  "confidence": 0.77,
  "flaw_breakdown": [
    {
      "flaw": "Slight discoloration near charging port",
      "severity": "moderate"
    },
    {
      "flaw": "Small screen scuff (non-functional)",
      "severity": "moderate"
    }
  ],
  "processing_time_ms": 2506,
  "graded_by": "ReLoop Vision AI v1.0 (mock)"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `grade_score` | int | 0–100 |
| `condition` | string | `like_new` \| `good` \| `fair` \| `poor` \| `damaged` |
| `condition_label` | string | Human label e.g. `"Fair"` |
| `confidence` | float | 0.0–1.0 |
| `flaw_breakdown` | array | Each item: `{"flaw": string, "severity": string}` |
| `severity` | string | `minor` \| `moderate` \| `significant` |
| `processing_time_ms` | int | Always ~2500 |

---

### 3.3 `POST /api/returns/dispose`

**Request Body**
```json
{
  "return_id": "RET-20260613-4ACDE9",
  "disposal_route": null,
  "ngo_id": null,
  "p2p_price": null
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `return_id` | string | ✅ | |
| `disposal_route` | string\|null | ❌ | If null, AI decides |
| `ngo_id` | string\|null | ❌ | Set if donating to specific NGO |
| `p2p_price` | float\|null | ❌ | Set to override AI p2p price |

**Response `200`**
```json
{
  "status": "ok",
  "return_id": "RET-20260613-4ACDE9",
  "disposition": "recycle",
  "disposition_label": "Responsible Recycling",
  "disposition_desc": "Item disassembled for raw material recovery.",
  "disposition_icon": "♻️",
  "estimated_resale_value": 5699.7,
  "p2p_offer_price": 0.0,
  "refund_amount": 11781.38,
  "green_credits_awarded": 30.0,
  "carbon": {
    "co2_saved_kg": 17.5,
    "co2_wasted_kg": 52.5,
    "base_footprint_kg": 70.0,
    "savings_percent": 25,
    "equivalence": {
      "value": 145.8,
      "unit": "km",
      "label": "km driven in a petrol car",
      "description": "Equivalent to 145.8 km of km driven in a petrol car"
    },
    "source_citation": "Source: EPA Product Carbon Footprint Guidelines 2023 & Ellen MacArthur Foundation Circular Economy Report 2022"
  },
  "reasoning": "Your Samsung Galaxy M34 5G will be responsibly recycled..."
}
```

| Top-level field | Type | Notes |
|----------------|------|-------|
| `disposition` | string | Enum — see [Enum Reference](#10-enum-reference) |
| `disposition_label` | string | Human-readable label |
| `disposition_desc` | string | One-sentence description |
| `disposition_icon` | string | Emoji icon |
| `estimated_resale_value` | float | INR |
| `p2p_offer_price` | float | INR, 0 if not p2p route |
| `refund_amount` | float | INR |
| `green_credits_awarded` | float | Credits to award on complete |
| `carbon` | object | See below |
| `reasoning` | string | Claude-generated or fallback explanation |

**`carbon` object**
| Field | Type | Notes |
|-------|------|-------|
| `co2_saved_kg` | float | kg CO₂ saved |
| `co2_wasted_kg` | float | kg CO₂ still emitted |
| `base_footprint_kg` | float | Total manufacturing footprint |
| `savings_percent` | int | % of footprint saved |
| `equivalence.value` | float | Numeric amount |
| `equivalence.unit` | string | e.g. `"km"`, `"bags"`, `"years"` |
| `equivalence.label` | string | e.g. `"km driven in a petrol car"` |
| `equivalence.description` | string | Full human sentence |
| `source_citation` | string | Data source string |

---

### 3.4 `GET /api/returns/{return_id}`

**Response `200`**
```json
{
  "status": "ok",
  "return_id": "RET-20260613-4ACDE9",
  "user_id": "user_priya_001",
  "product_id": "prod_samsung_m34_001",
  "product_name": "Samsung Galaxy M34 5G",
  "return_reason": "battery drains fast",
  "reason_detail": null,
  "item_condition": "fair",
  "image_url": null,
  "status": "disposed",
  "ai_grade_score": 61.0,
  "disposal_route": "recycle",
  "co2_saved_kg": 17.5,
  "green_credits_awarded": 30.0,
  "ai_reasoning": "Your Samsung Galaxy M34 5G...",
  "created_at": "2026-06-13T10:00:00.000000",
  "updated_at": "2026-06-13T10:05:00.000000"
}
```

> Fields present depend on how far through the flow the return has progressed. Always guard with optional chaining (`?.`).

**Response `404`** — return not found → see [Error Shape](#9-error-shape)

---

### 3.5 `POST /api/returns/{return_id}/p2p`

**Request Body**
```json
{
  "asking_price": 12000.0,
  "description": "Minor scratches, all functions working"
}
```

**Response `200`**
```json
{
  "status": "ok",
  "return_id": "RET-20260613-4ACDE9",
  "listing_id": "P2P-RET-20260613-4ACDE9",
  "asking_price": 12000.0,
  "message": "Item listed on ReLoop P2P marketplace",
  "estimated_sale_time_days": 7
}
```

---

### 3.6 `POST /api/returns/{return_id}/complete`

**Request Body**
```json
{
  "notes": "Customer confirmed return"
}
```

**Response `200` — non-refurbish route**
```json
{
  "status": "ok",
  "return_id": "RET-20260613-4ACDE9",
  "disposition": "recycle",
  "credits_awarded": 30.0,
  "message": "Return completed successfully",
  "renewed_listing": null,
  "notes": "Customer confirmed return"
}
```

**Response `200` — refurbish route** (`renewed_listing` is populated)
```json
{
  "status": "ok",
  "return_id": "RET-20260613-4ACDE9",
  "disposition": "refurbish",
  "credits_awarded": 150.0,
  "message": "Return completed successfully",
  "renewed_listing": {
    "listing_id": "AMZ-RENEWED-K3X9PQ2A",
    "asin": "B00123456789",
    "title": "Samsung Galaxy M34 5G — Amazon Renewed (Good)",
    "price": 11399.4,
    "currency": "INR",
    "condition": "Renewed",
    "grade": "good",
    "url": "https://www.amazon.in/dp/B00123456789?th=1&psc=1",
    "status": "ACTIVE",
    "listed_at": "2026-06-13T10:10:00.000000",
    "source": "SP-API Mock v1.0"
  },
  "notes": null
}
```

| Field | Type | Notes |
|-------|------|-------|
| `disposition` | string | Enum value |
| `credits_awarded` | float | Credited to user's ledger |
| `renewed_listing` | object\|null | Only present when `disposition == "refurbish"` |
| `renewed_listing.listing_id` | string | Format: `AMZ-RENEWED-XXXXXXXX` |
| `renewed_listing.url` | string | Mock Amazon product URL |

---

## 4. Passport

### `GET /api/passport/{product_id}`

**Response `200`**
```json
{
  "status": "ok",
  "product_id": "prod_samsung_m34_001",
  "product_name": "Samsung Galaxy M34 5G",
  "category": "electronics",
  "total_co2_kg": 70.0,
  "current_owner": "user_priya_001",
  "current_condition": "good",
  "events": [
    {
      "event_type": "manufactured",
      "timestamp": "2025-12-15T11:03:56.795329",
      "actor": "system",
      "notes": "Manufactured at Samsung Noida plant",
      "location": "Noida, UP",
      "co2_delta_kg": 70.0,
      "condition_at_event": "like_new"
    },
    {
      "event_type": "sold",
      "timestamp": "2026-03-15T11:03:56.795331",
      "actor": "user_priya_001",
      "notes": "Original purchase via Amazon",
      "location": "Bengaluru, KA",
      "co2_delta_kg": 0.0,
      "condition_at_event": "like_new"
    }
  ],
  "created_at": "2025-12-15T11:03:56.795334",
  "updated_at": "2026-03-15T11:03:56.795335",
  "trust_score": 70,
  "lives_count": 0,
  "event_count": 2
}
```

| Field | Type | Notes |
|-------|------|-------|
| `total_co2_kg` | float | Running CO₂ total across lifecycle |
| `trust_score` | int | 0–100, computed dynamically |
| `lives_count` | int | Number of new owners / lives |
| `event_count` | int | Total events in passport |
| `events[].event_type` | string | Enum — see [Enum Reference](#10-enum-reference) |
| `events[].co2_delta_kg` | float | Positive = emitted, negative = saved |

**Response `404`** — passport not found → see [Error Shape](#9-error-shape)

---

### `POST /api/passport/{product_id}/event`

**Request Body**
```json
{
  "event_type": "repaired",
  "actor": "user_priya_001",
  "notes": "Screen replaced at service center",
  "location": "Bengaluru, KA",
  "co2_delta_kg": -2.5,
  "condition_at_event": "good"
}
```

| Field | Type | Required |
|-------|------|----------|
| `event_type` | string | ✅ |
| `actor` | string | ✅ |
| `notes` | string | ❌ |
| `location` | string | ❌ |
| `co2_delta_kg` | float | ❌ |
| `condition_at_event` | string | ❌ |

**Response `200`**
```json
{
  "status": "ok",
  "product_id": "prod_samsung_m34_001",
  "event_added": {
    "event_type": "repaired",
    "timestamp": "2026-06-13T12:00:00.000000",
    "actor": "user_priya_001",
    "notes": "Screen replaced at service center",
    "location": "Bengaluru, KA",
    "co2_delta_kg": -2.5,
    "condition_at_event": "good"
  },
  "message": "Lifecycle event appended to passport"
}
```

---

## 5. Credits

### `GET /api/credits/{user_id}`

**Response `200`**
```json
{
  "status": "ok",
  "user_id": "user_priya_001",
  "balance": 240.0,
  "total_earned": 340.0,
  "total_spent": 100.0,
  "transactions": [
    {
      "amount": 120.0,
      "transaction_type": "earned_return",
      "reference_id": "RET-20260613-4ACDE9",
      "notes": "Return completed: refurbish",
      "balance_after": 0,
      "timestamp": "2026-06-13T11:30:00.000000"
    }
  ]
}
```

| Field | Type | Notes |
|-------|------|-------|
| `balance` | float | Current spendable balance |
| `total_earned` | float | All-time earned |
| `total_spent` | float | All-time spent |
| `transactions[].amount` | float | Positive = earned, negative = spent |
| `transactions[].transaction_type` | string | Enum — see [Enum Reference](#10-enum-reference) |
| `transactions[].balance_after` | float | Balance after this transaction |

---

## 6. User Dashboard

### `GET /api/user/{user_id}/dashboard`

**Response `200`**
```json
{
  "status": "ok",
  "user_id": "user_priya_001",
  "user": {
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "city": "Bengaluru",
    "member_since": "2026-04-14"
  },
  "impact": {
    "co2_saved_kg": 17.5,
    "trees_equivalent": 0.8,
    "returns_avoided": 0,
    "items_refurbished": 0,
    "items_donated": 0,
    "items_p2p": 0,
    "total_returns": 2
  },
  "green_credits": {
    "balance": 270.0,
    "total_earned": 370.0,
    "total_spent": 100.0
  },
  "recent_returns": [
    {
      "return_id": "RET-20260613-4ACDE9",
      "product_name": "Samsung Galaxy M34 5G",
      "status": "completed",
      "route": "recycle",
      "credits_earned": 30.0,
      "date": "2026-06-13"
    }
  ],
  "leaderboard_rank": 42,
  "sustainability_score": 60
}
```

| Field | Type | Notes |
|-------|------|-------|
| `user.member_since` | string | `YYYY-MM-DD` date only |
| `impact.co2_saved_kg` | float | Sum of all completed returns |
| `impact.trees_equivalent` | float | `co2_saved_kg / 21.0` |
| `impact.returns_avoided` | int | Returns with `status == "prevented"` |
| `recent_returns[].route` | string\|null | Disposal route, null if not yet disposed |
| `recent_returns[].date` | string | `YYYY-MM-DD` date only |
| `leaderboard_rank` | int | User's rank (currently static) |
| `sustainability_score` | int | 0–100 computed score |

---

## 7. Prevention

### `GET /api/prevention/{user_id}/{product_id}`

**Query params**
| Param | Type | Required |
|-------|------|----------|
| `return_reason` | string | ❌ (use `+` for spaces: `battery+drains+fast`) |

**Response `200`**
```json
{
  "status": "ok",
  "user_id": "user_priya_001",
  "product_id": "prod_samsung_m34_001",
  "product_name": "Samsung Galaxy M34 5G",
  "should_prevent": true,
  "prevention_score": 60,
  "nudge_message": "Before you return — your Samsung Galaxy M34 5G might be fixable! Returning it adds 3.5 kg CO₂ to the atmosphere.",
  "quick_fixes": [
    "Charge to 100% then drain to 0% once to recalibrate battery",
    "Turn off Background App Refresh in Settings",
    "Disable 5G when not needed — saves up to 30% battery"
  ],
  "resale_value_estimate": 10449.45,
  "co2_cost_of_return_kg": 3.5,
  "green_credits_if_kept": 50.0,
  "green_credits_if_returned": 120.0,
  "recommendation": "keep_and_fix"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `should_prevent` | bool | `true` = try to stop the return |
| `prevention_score` | int | 0–100; ≥55 = should prevent |
| `quick_fixes` | string[] | 2–3 actionable tips |
| `resale_value_estimate` | float | What they could get selling it (INR) |
| `co2_cost_of_return_kg` | float | Environmental cost of returning |
| `green_credits_if_kept` | float | Credits if they keep/fix |
| `green_credits_if_returned` | float | Credits if they proceed with return |
| `recommendation` | string | `keep_and_fix` \| `keep_and_resell` \| `return_ok` |

---

## 8. Demo Reset

### `POST /api/demo/reset`

No request body.

**Response `200`**
```json
{
  "status": "ok",
  "message": "🔄 Demo DB reset — all collections cleared and re-seeded",
  "seeded": {
    "products": 5,
    "users": 1,
    "ngos": 3,
    "passports": 2
  },
  "timestamp": "2026-06-13T12:00:00.000000"
}
```

> ⚠️ This drops ALL data. Use only for demo resets.

---

## 9. Error Shape

All `4xx` and `5xx` errors return:
```json
{
  "detail": "Return RET-XXXX not found"
}
```

| Status | When |
|--------|------|
| `404` | Resource not found (product, return, passport) |
| `422` | Request body validation failed (missing required field) |
| `500` | Unexpected server error |

---

## 10. Enum Reference

### `disposition` values
| Value | Meaning |
|-------|---------|
| `refurbish` | Fix and list as Amazon Renewed |
| `p2p` | Peer-to-peer marketplace resale |
| `ngo_donate` | Donate to NGO partner |
| `recycle` | Raw material recovery |
| `landfill` | Controlled disposal (last resort) |

### `condition` values
| Value | Label |
|-------|-------|
| `like_new` | Excellent |
| `good` | Good |
| `fair` | Fair |
| `poor` | Poor |
| `damaged` | Damaged |

### `return.status` progression
```
initiated → graded → disposed → p2p_listed → completed
                                            ↑
                                        prevented (if nudge worked)
```

### `passport.event_type` values
| Value | Triggered by |
|-------|-------------|
| `manufactured` | Seed / system |
| `sold` | Seed / system |
| `returned` | `POST /returns/dispose` |
| `refurbished` | `POST /returns/{id}/complete` (refurbish route) |
| `p2p_sold` | `POST /returns/{id}/complete` (p2p route) |
| `donated` | `POST /returns/{id}/complete` (ngo_donate route) |
| `recycled` | `POST /returns/{id}/complete` (recycle/landfill route) |
| `repaired` | `POST /passport/{id}/event` (manual) |

### `transaction_type` values
| Value | Meaning |
|-------|---------|
| `earned_return` | Return completed via sustainable route |
| `earned_prevention` | User kept item instead of returning |
| `spent_discount` | Used credits for order discount |
| `spent_donation` | Donated credits to NGO |
| `bonus_referral` | Referral bonus |
| `adjustment` | Manual admin adjustment |

### `recommendation` values (prevention endpoint)
| Value | Meaning |
|-------|---------|
| `keep_and_fix` | Nudge to keep — fixable issue |
| `keep_and_resell` | Nudge to P2P resell instead |
| `return_ok` | Return is reasonable (genuine defect) |

---

## Quick Reference — All Endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `GET` | `/api/health` | — | |
| `GET` | `/api/products` | — | `?category=electronics&limit=10` |
| `GET` | `/api/products/{product_id}` | — | |
| `POST` | `/api/returns/initiate` | — | Step 1 |
| `POST` | `/api/returns/grade` | — | Step 2, ~2.5s |
| `POST` | `/api/returns/dispose` | — | Step 3 |
| `GET` | `/api/returns/{return_id}` | — | |
| `POST` | `/api/returns/{return_id}/p2p` | — | |
| `POST` | `/api/returns/{return_id}/complete` | — | Final step |
| `GET` | `/api/passport/{product_id}` | — | |
| `POST` | `/api/passport/{product_id}/event` | — | |
| `GET` | `/api/credits/{user_id}` | — | |
| `GET` | `/api/user/{user_id}/dashboard` | — | |
| `GET` | `/api/prevention/{user_id}/{product_id}` | — | `?return_reason=battery+drains` |
| `POST` | `/api/demo/reset` | — | ⚠️ Drops all data |

> **Interactive docs:** `http://localhost:8000/docs` (Swagger UI)
