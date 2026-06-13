from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from models import PyObjectId


TransactionType = Literal[
    "earned_return",        # returned item via sustainable route
    "earned_prevention",    # convinced NOT to return
    "spent_discount",       # used credits for discount
    "spent_donation",       # donated credits to NGO
    "bonus_referral",       # referral bonus
    "adjustment",           # manual admin adjustment
]


class GreenCreditTransaction(BaseModel):
    user_id: str
    amount: float                               # + = earned, - = spent
    transaction_type: TransactionType
    reference_id: Optional[str] = None         # return_id, order_id, etc.
    notes: Optional[str] = None
    balance_after: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    def to_dict(self) -> dict:
        d = self.model_dump(exclude_none=True)
        if isinstance(d.get("timestamp"), datetime):
            d["timestamp"] = d["timestamp"].isoformat()
        return d


class GreenCreditsLedger(BaseModel):
    """Aggregated view per user — stored as a single doc per user_id."""
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    balance: float = 0.0
    total_earned: float = 0.0
    total_spent: float = 0.0
    transactions: list[GreenCreditTransaction] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    def to_dict(self) -> dict:
        d = self.model_dump(by_alias=True, exclude_none=True)
        if "_id" in d and d["_id"] is None:
            del d["_id"]
        if isinstance(d.get("updated_at"), datetime):
            d["updated_at"] = d["updated_at"].isoformat()
        d["transactions"] = [
            t.to_dict() if isinstance(t, GreenCreditTransaction) else t
            for t in self.transactions
        ]
        return d
