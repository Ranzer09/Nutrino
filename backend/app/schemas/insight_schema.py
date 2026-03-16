from pydantic import BaseModel
from typing import List


class NutritionInsightResponse(BaseModel):
    """
    Human readable nutrition insights.
    """

    summary: str
    warnings: List[str]
    positives: List[str]