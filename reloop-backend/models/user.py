from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from models import PyObjectId


class GreenCreditSummary(BaseModel):
    total_earned: float = 0.0
    total_spent: float = 0.0
    balance: float = 0.0


class UserBase(BaseModel):
    user_id: str                           # external / stable ID e.g. "user_priya_001"
    name: str
    email: str
    phone: Optional[str] = None
    city: Optional[str] = None
    green_credits: GreenCreditSummary = Field(default_factory=GreenCreditSummary)
    total_returns: int = 0
    co2_saved_kg: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(None, alias="_id")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    def to_dict(self) -> dict:
        d = self.model_dump(by_alias=True, exclude_none=True)
        if "_id" in d and d["_id"] is None:
            del d["_id"]
        if isinstance(d.get("created_at"), datetime):
            d["created_at"] = d["created_at"].isoformat()
        return d


class UserOut(UserBase):
    id: str
    model_config = {"populate_by_name": True}
