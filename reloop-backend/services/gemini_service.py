"""
services/gemini_service.py
Live Gemini API integration for disposition reasoning using the modern google-genai SDK.
2 retries with exponential backoff; fallback template if API unavailable.
Never raises — always returns a string.
"""

import asyncio
import logging
from typing import Optional

from google import genai
from google.genai import types
from config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

# ── Prompts ───────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are ReLoop's sustainability advisor — a friendly, knowledgeable AI 
embedded in Amazon's circular economy platform. Your role is to explain return decisions 
to customers in a warm, encouraging tone.

Rules:
- Always be concise: 2–3 sentences maximum.
- Lead with what happens to the item, then mention the environmental benefit.
- Use specific numbers (CO₂ kg, green credits) when provided.
- End with a positive note about the customer's contribution.
- Never use jargon. Write at a 10th-grade reading level.
- Do NOT start with "I" or "As an AI"."""

def _build_user_prompt(
    product_name: str,
    category: str,
    return_reason: str,
    condition: str,
    grade_score: float,
    disposition: str,
    co2_saved_kg: float,
    green_credits: float,
) -> str:
    disposition_verbs = {
        "refurbish":  "refurbished and listed as Amazon Renewed",
        "p2p":        "listed on the ReLoop peer-to-peer marketplace",
        "ngo_donate": "donated to a verified NGO partner",
        "recycle":    "sent for responsible material recycling",
        "landfill":   "disposed of responsibly",
    }
    action = disposition_verbs.get(disposition, disposition)

    return (
        f"Product: {product_name} ({category})\n"
        f"Return reason: {return_reason}\n"
        f"Condition assessed: {condition} (score {grade_score}/100)\n"
        f"Decision: Item will be {action}\n"
        f"CO₂ saved: {co2_saved_kg} kg\n"
        f"Green credits awarded to customer: {green_credits}\n\n"
        f"Write a 2–3 sentence explanation for the customer about this decision "
        f"and why it's a positive outcome for them and the planet."
    )

# ── Fallback templates ────────────────────────────────────────────────────────

FALLBACK_TEMPLATES = {
    "refurbish": (
        "Your {product_name} will be professionally refurbished and listed as Amazon Renewed, "
        "giving it a second life with a new owner. This saves {co2_saved_kg} kg of CO₂ — "
        "equivalent to keeping a phone out of a landfill for years. "
        "You've earned {green_credits} Green Credits for making the sustainable choice! 🌱"
    ),
    "p2p": (
        "Your {product_name} is in great shape and will be listed on ReLoop's marketplace "
        "where another customer can buy it directly from you. "
        "This saves {co2_saved_kg} kg of CO₂ and earns you {green_credits} Green Credits. "
        "Thank you for keeping products in circulation! 🤝"
    ),
    "ngo_donate": (
        "Your {product_name} will be donated to one of our verified NGO partners, "
        "where it will make a real difference for someone in need. "
        "This choice saves {co2_saved_kg} kg of CO₂ and earns you {green_credits} Green Credits — "
        "a win for people and the planet. 💚"
    ),
    "recycle": (
        "Your {product_name} will be responsibly disassembled, with valuable materials recovered "
        "and safely processed. This recovers {co2_saved_kg} kg of CO₂ equivalent in raw materials. "
        "You've earned {green_credits} Green Credits for choosing responsible disposal. ♻️"
    ),
    "landfill": (
        "Your {product_name} is too damaged for reuse, but it will be disposed of "
        "safely through our certified waste partners to minimise environmental impact. "
        "You've still earned {green_credits} Green Credits for using ReLoop instead of "
        "discarding it yourself. 🙏"
    ),
}


def _fallback_message(
    product_name: str,
    disposition: str,
    co2_saved_kg: float,
    green_credits: float,
) -> str:
    template = FALLBACK_TEMPLATES.get(disposition, FALLBACK_TEMPLATES["refurbish"])
    return template.format(
        product_name=product_name,
        co2_saved_kg=co2_saved_kg,
        green_credits=int(green_credits),
    )


# ── Main function ─────────────────────────────────────────────────────────────

async def get_disposition_reasoning(
    product_name: str,
    category: str,
    return_reason: str,
    condition: str,
    grade_score: float,
    disposition: str,
    co2_saved_kg: float,
    green_credits: float = 0.0,
) -> str:
    """
    Call Gemini for a 2–3 sentence disposition explanation.
    Falls back to a template if API key missing or call fails after 2 retries.
    Never raises.
    """
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — using fallback template")
        return _fallback_message(product_name, disposition, co2_saved_kg, green_credits)

    user_prompt = _build_user_prompt(
        product_name, category, return_reason, condition,
        grade_score, disposition, co2_saved_kg, green_credits,
    )

    for attempt in range(1, 3):        # 2 retries
        try:
            # Initialize modern google-genai client
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            # Call Gemini async API
            response = await client.aio.models.generate_content(
                model="gemini-1.5-flash",
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT
                )
            )
            if response.text:
                return response.text.strip()
            raise ValueError("Empty response received from Gemini API")

        except Exception as e:
            logger.error(f"Gemini API error (attempt {attempt}): {e}")
            if attempt == 2:
                break
            await asyncio.sleep(2 ** attempt)

    logger.warning("Gemini API failed after retries — using fallback template")
    return _fallback_message(product_name, disposition, co2_saved_kg, green_credits)
