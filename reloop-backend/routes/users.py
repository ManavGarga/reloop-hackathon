from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db

router = APIRouter()

class UserProfileUpdate(BaseModel):
    name: str
    email: str
    phone: str
    city: str

@router.get("/{user_id}")
async def get_user_profile(user_id: str):
    db = get_db()
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}")
async def update_user_profile(user_id: str, profile: UserProfileUpdate):
    db = get_db()
    res = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {
            "name": profile.name,
            "email": profile.email,
            "phone": profile.phone,
            "city": profile.city
        }}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "ok", "message": "Profile updated successfully"}
