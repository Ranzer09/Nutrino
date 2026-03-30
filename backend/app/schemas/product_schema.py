from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict

from app.schemas.nutrition_schema import NutritionAnalysisResponse, IngredientAnalysis


class ProductResponse(BaseModel):
    """
    Clean API response model for product data.
    """

    id: int
    barcode: str
    name: Optional[str]
    brand: Optional[str]
    category: Optional[str]
    image_url: Optional[str]
    nutriscore: Optional[str]

    energy_kcal: Optional[float]
    fat: Optional[float]
    saturated_fat: Optional[float]
    sugars: Optional[float]
    salt: Optional[float]
    protein: Optional[float]
    fiber: Optional[float]

    cached_at: datetime

    class Config:
        from_attributes = True