from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.product_service import get_product_by_barcode, create_product
from app.services.openfoodfacts_service import fetch_product_from_openfoodfacts
from app.services.nutrition_analysis import analyze_nutrition
from app.schemas.barcode_schema import BarcodeLookupResponse
from app.schemas.product_schema import ProductResponse
from app.schemas.nutrition_schema import NutritionAnalysisResponse
from app.services.nutrition_insights import generate_nutrition_insights

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/{barcode}", response_model=BarcodeLookupResponse)
async def get_product(barcode: str, db: Session = Depends(get_db)):

    product = get_product_by_barcode(db, barcode)

    if product:

        analysis = analyze_nutrition(product.__dict__)
        insights = generate_nutrition_insights(analysis)

        return {
            "source": "cache",
            "product": product,
            "analysis": analysis,
            "insights": insights
        }

    data = await fetch_product_from_openfoodfacts(barcode)

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Product not found in database or OpenFoodFacts"
        )

    product = create_product(db, data)

    analysis = analyze_nutrition(data)
    insights = generate_nutrition_insights(analysis)

    return {
        "source": "openfoodfacts",
        "product": product,
        "analysis": analysis,
        "insights": insights
    }