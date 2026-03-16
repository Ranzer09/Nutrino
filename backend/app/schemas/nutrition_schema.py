from pydantic import BaseModel
from typing import Optional


class NutrientInfo(BaseModel):
    """
    Detailed nutrient information.
    """

    value: Optional[float]
    percent_daily: Optional[int]
    level: str


class NutritionAnalysisResponse(BaseModel):
    """
    Structured nutrition analysis.
    """

    sugars: NutrientInfo
    saturated_fat: NutrientInfo
    fat: NutrientInfo
    salt: NutrientInfo