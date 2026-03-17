from pydantic import BaseModel
from datetime import datetime


class ProductResponse(BaseModel):
    """
    Clean API response model for product data.
    """

    id: int
    barcode: str
    name: str | None
    brand: str | None
    image_url: str | None
    nutriscore: str | None

    energy_kcal: float | None
    fat: float | None
    saturated_fat: float | None
    sugars: float | None
    salt: float | None
    protein: float | None
    fiber: float | None

    cached_at: datetime

    class ConfigDict:
        from_attributes = True