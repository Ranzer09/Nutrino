from pydantic import BaseModel

from app.schemas.product_schema import ProductResponse
from app.schemas.nutrition_schema import NutritionAnalysisResponse
from app.schemas.insight_schema import NutritionInsightResponse


class BarcodeLookupResponse(BaseModel):

    source: str
    product: ProductResponse

    analysis: NutritionAnalysisResponse
    insights: NutritionInsightResponse