from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from models import PyObjectId


ReturnStatus = Literal[
    "initiated",        # customer just submitted
    "graded",           # AI graded condition
    "disposed",         # final decision made
    "p2p_listed",       # listed on peer-to-peer marketplace
    "completed",        # fully resolved
    "prevented",        # user convinced NOT to return
]

DisposalRoute = Literal[
    "refurbish",        # minor fix → resell
    "p2p",              # peer-to-peer resale
    "ngo_donate",       # donate to NGO
    "recycle",          # raw material recovery
    "landfill",         # last resort
]

ItemCondition = Literal["like_new", "good", "fair", "poor", "damaged"]


class ReturnRequestBase(BaseModel):
    user_id: str
    product_id: str
    product_name: str
    return_reason: str
    reason_detail: Optional[str] = None
    item_condition: Optional[ItemCondition] = None
    image_url: Optional[str] = None


class ReturnRequestInDB(ReturnRequestBase):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    return_id: str                          # human-readable e.g. "RET-20240613-0001"
    status: ReturnStatus = "initiated"
    disposal_route: Optional[DisposalRoute] = None
    ai_grade_score: Optional[float] = None  # 0–100
    ai_grade_notes: Optional[str] = None
    co2_saved_kg: Optional[float] = None
    green_credits_awarded: Optional[float] = None
    p2p_price: Optional[float] = None
    ngo_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    def to_dict(self) -> dict:
        d = self.model_dump(by_alias=True, exclude_none=True)
        if "_id" in d and d["_id"] is None:
            del d["_id"]
        for field in ("created_at", "updated_at"):
            if isinstance(d.get(field), datetime):
                d[field] = d[field].isoformat()
        return d


class ReturnRequestOut(ReturnRequestBase):
    id: str
    return_id: str
    status: ReturnStatus
    disposal_route: Optional[DisposalRoute] = None
    ai_grade_score: Optional[float] = None
    green_credits_awarded: Optional[float] = None
    co2_saved_kg: Optional[float] = None
    created_at: str

    model_config = {"populate_by_name": True}
