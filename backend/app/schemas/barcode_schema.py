from pydantic import BaseModel
from app.schemas.product_schema import ProductResponse
from app.schemas.nutrition_schema import NutritionAnalysisResponse, IngredientAnalysis
from app.schemas.insight_schema import NutritionInsightResponse
from app.schemas.nutrition_schema import EnergyAnalysisResponse   # new

class BarcodeLookupResponse(BaseModel):
    source: str
    product: ProductResponse
    analysis: NutritionAnalysisResponse
    ingredient_analysis: IngredientAnalysis
    insights: NutritionInsightResponse
    energy: EnergyAnalysisResponse   