from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
from database import get_db

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List] = []
    user_id: Optional[str] = "user_priya_001"

@router.post("/chat")
async def chat_with_advisor(req: ChatRequest):
    message_lower = req.message.lower()
    
    # Query MongoDB for user details
    user_id = req.user_id or "user_priya_001"
    db = get_db()
    
    user = await db.users.find_one({"user_id": user_id})
    credits_ledger = await db.green_credits.find_one({"user_id": user_id})
    
    user_name = user.get("name", "Priya Sharma") if user else "Priya Sharma"
    first_name = user_name.split(" ")[0]
    credits_bal = Math_round_credits = int(credits_ledger.get("balance", 240)) if credits_ledger else 240
    co2_saved = user.get("co2_saved_kg", 78.2) if user else 78.2
    city = user.get("city", "Bengaluru") if user else "Bengaluru"

    # Fallback ReLoop responses (customized dynamically)
    FALLBACK_RESPONSES = {
        "hello": f"Hello {first_name}! Welcome to Amazon ReLoop. How can I help you choose sustainable return options or manage your Green Credits today?",
        "credits": f"You currently have {credits_bal} Green Credits! You can earn more by choosing Peer-to-Peer recommerce or local NGO donation. Credits can be redeemed for Amazon Gift Cards on your Profile page.",
        "return": "Initiating a ReLoop return is easy! Go to the 'Returns' tab, select your product, and choose 'P2P Recommerce' or 'NGO Donation' to keep items out of landfills and earn credits.",
        "ngo": "We partner with leading local NGOs like the Digital Bridge Foundation (which refurbishes electronics for students) and Clothes Forward (which distributes garments to rural communities).",
        "renewed": "Amazon Renewed products are certified refurbished items that are professionally tested, graded by our AI system, and backed by a 1-year brand warranty. You save up to 50% on cost and 80% on carbon footprint!",
    }
    
    # Try using Gemini API if key is available
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            system_instruction = (
                "You are the Amazon ReLoop Sustainability Advisor. You help users make eco-friendly return choices "
                "(P2P recommerce, certified refurbishing, NGO donations), track carbon offset credits, and reduce returns. "
                f"The current user is {user_name} from {city} who has {credits_bal} credits and saved {co2_saved:.1f} kg of CO2. Keep answers concise, helpful, and highly customer-obsessed. "
                "CRITICAL: Do NOT use markdown bold/italic/bullet characters like *, **, __ in your output. Use plain text, double line breaks for spacing, and clean emojis (like 1️⃣, 2️⃣, 🟢, ♻️) for lists."
            )
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=req.message,
                config={"system_instruction": system_instruction}
            )
            if response and response.text:
                return {"status": "ok", "reply": response.text.strip()}
        except Exception as e:
            print(f"⚠️ Gemini chat call failed: {e}. Falling back to rule-based answers.")
 
    # Rule-based fallback
    reply = f"Thank you for asking, {first_name}! Reducing return shipping is key to saving carbon. Consider checking size guidelines carefully before purchasing clothing, or choose certified refurbished items. Let me know if you want to learn more about Green Credits, NGO donations, or P2P recommerce."
    for key, val in FALLBACK_RESPONSES.items():
        if key in message_lower:
            reply = val
            break
            
    return {"status": "ok", "reply": reply}
