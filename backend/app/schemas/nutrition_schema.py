from pydantic import BaseModel
from typing import Dict, Optional, List


class NutrientInfo(BaseModel):
    """
    Detailed nutrient information (per 100g).
    """

    value: Optional[float]
    percent_daily: Optional[float]  
    limit: float
    level: str


class NutritionAnalysisResponse(BaseModel):
    """
    Structured nutrition analysis.
    """
    per_100g: Dict[str, NutrientInfo]     
    per_serving: Dict[str, NutrientInfo]
    serving_quantity: Optional[float]
    serving_size: Optional[str]
    serving_unit_parsed: Optional[str]
    serving_quantity_raw: Optional[float]

class EnergyAnalysisResponse(BaseModel):
    per_100g: Optional[float]
    per_serving: Optional[float]

class IngredientDetail(BaseModel):
    ingredient: str
    severity: Optional[str] = None
    message: str

class IngredientAnalysis(BaseModel):
    warnings: List[IngredientDetail]
    positives: List[Dict]   
    severity_counts: Dict[str, int]
    total_warnings: int
    total_positives: int
    ingredient_summary: str