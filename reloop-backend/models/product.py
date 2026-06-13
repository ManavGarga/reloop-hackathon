from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from models import PyObjectId


class ProductBase(BaseModel):
    name: str
    category: str                          # electronics | clothing | books | appliances
    brand: str
    price_new: float                       # MRP / original price in INR
    carbon_footprint_kg: float             # CO₂ equivalent to manufacture
    return_rate_percent: float             # historical return rate 0–100
    common_return_reasons: List[str] = []
    image_url: Optional[str] = None
    description: Optional[str] = None


class ProductInDB(ProductBase):
    id: Optional[PyObjectId] = Field(None, alias="_id")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    def to_dict(self) -> dict:
        d = self.model_dump(by_alias=True, exclude_none=True)
        return d


class ProductOut(ProductBase):
    id: str

    model_config = {"populate_by_name": True}
