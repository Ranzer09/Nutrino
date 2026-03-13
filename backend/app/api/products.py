from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.product_service import get_product_by_barcode, create_product
from app.services.openfoodfacts_service import fetch_product_from_openfoodfacts
from app.services.nutrition_analysis import analyze_nutrition

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/{barcode}")
async def get_product(barcode: str, db: Session = Depends(get_db)):
    """
    Barcode lookup endpoint.
    """

    product = get_product_by_barcode(db, barcode)

    if product:
        analysis = analyze_nutrition(product.__dict__)

        return {
            "source": "cache",
            "product": product,
            "analysis": analysis
        }

    data = await fetch_product_from_openfoodfacts(barcode)

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Product not found in database or OpenFoodFacts"
        )

    product = create_product(db, data)

    analysis = analyze_nutrition(data)

    return {
        "source": "openfoodfacts",
        "product": product,
        "analysis": analysis
    }