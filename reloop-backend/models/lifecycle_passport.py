from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from models import PyObjectId


EventType = Literal[
    "manufactured",
    "sold",
    "returned",
    "refurbished",
    "p2p_sold",
    "donated",
    "recycled",
    "repaired",
]


class PassportEvent(BaseModel):
    event_type: EventType
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    actor: str                                  # user_id, seller_id, ngo_id, "system"
    notes: Optional[str] = None
    location: Optional[str] = None
    co2_delta_kg: Optional[float] = None        # + = emitted, - = saved
    condition_at_event: Optional[str] = None

    def to_dict(self) -> dict:
        d = self.model_dump(exclude_none=True)
        if isinstance(d.get("timestamp"), datetime):
            d["timestamp"] = d["timestamp"].isoformat()
        return d


class LifecyclePassportBase(BaseModel):
    product_id: str
    product_name: str
    category: str
    total_co2_kg: float = 0.0               # running total across lifecycle
    current_owner: Optional[str] = None
    current_condition: Optional[str] = None
    events: List[PassportEvent] = []


class LifecyclePassportInDB(LifecyclePassportBase):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    def to_dict(self) -> dict:
        d = self.model_dump(by_alias=True, exclude_none=True)
        if "_id" in d and d["_id"] is None:
            del d["_id"]
        for f in ("created_at", "updated_at"):
            if isinstance(d.get(f), datetime):
                d[f] = d[f].isoformat()
        # serialise nested events
        d["events"] = [e.to_dict() if isinstance(e, PassportEvent) else e for e in self.events]
        return d


class LifecyclePassportOut(LifecyclePassportBase):
    id: str
    created_at: str
    model_config = {"populate_by_name": True}
