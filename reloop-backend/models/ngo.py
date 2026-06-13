from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from models import PyObjectId


NgoCategory = Literal[
    "electronics",
    "clothing",
    "books",
    "appliances",
    "general",
]


class NgoBase(BaseModel):
    ngo_id: str                             # stable slug e.g. "ngo_digital_bridge_001"
    name: str
    description: str
    category: NgoCategory
    city: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    items_received: int = 0
    active: bool = True


class NgoInDB(NgoBase):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    def to_dict(self) -> dict:
        d = self.model_dump(by_alias=True, exclude_none=True)
        if "_id" in d and d["_id"] is None:
            del d["_id"]
        if isinstance(d.get("created_at"), datetime):
            d["created_at"] = d["created_at"].isoformat()
        return d


class NgoOut(NgoBase):
    id: str
    model_config = {"populate_by_name": True}
