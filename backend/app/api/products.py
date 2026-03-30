from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.utils.product_service import get_product_by_barcode, create_product, update_product
from app.utils.openfoodfacts_service import fetch_product_from_openfoodfacts
from app.utils.analysis_service import compute_analysis
from app.utils.cache_service import needs_refresh
from app.schemas.barcode_schema import BarcodeLookupResponse
from app.core.rate_limiter import limiter
from app.utils.serving_parser import parse_serving_size

router = APIRouter(prefix="/products", tags=["products"])



@router.get("/{barcode}", response_model=BarcodeLookupResponse)
@limiter.limit("10/minute")
async def get_product(
    barcode: str,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    # Set browser cache header
    response.headers["Cache-Control"] = "public, max-age=3600"

    # Input Validation
    if not barcode.isdigit():
        raise HTTPException(status_code=400, detail="Barcode must contain only numbers")

    # 1. INITIAL DB CHECK
    product = get_product_by_barcode(db, barcode)
    source = "cache" # Default assumption

    # 2. DECIDE IF WE NEED EXTERNAL DATA
    # We fetch fresh data if it's not in DB OR if the cache is stale
    if not product or needs_refresh(product):
        # Fetch from OpenFoodFacts
        external_data = await fetch_product_from_openfoodfacts(barcode)
        
        if not external_data:
            raise HTTPException(
                status_code=404,
                detail="Product not found in database or OpenFoodFacts",
            )

        qty_float = external_data.get("serving_quantity")
        qty_from_size = parse_serving_size(external_data.get("serving_size"))
        if qty_from_size and not qty_float:
            external_data["serving_quantity"] = qty_from_size

        # Run our analysis logic (Ingredients + Nutrition)
        analysis_results = compute_analysis(external_data)
        
        # Merge external raw data with our computed analysis
        full_data = {**external_data, **analysis_results}

        if product:
            # It existed but stale data, so Update it
            product = update_product(db, product, full_data)
            source = "refreshed"
        else:
            # Brand new product, so Create it
            product = create_product(db, full_data)
            source = "openfoodfacts"
    
    energy_100g = getattr(product, "energy_kcal", None)
    serving_qty = getattr(product, "serving_quantity", None)

    if product.nutrition_analysis and isinstance(product.nutrition_analysis, dict):
        serving_qty = product.nutrition_analysis.get("serving_quantity") or serving_qty

    energy_per_serving = None
    if isinstance(energy_100g, (int, float)) and isinstance(serving_qty, (int, float)) and serving_qty > 0:
        energy_per_serving = round(energy_100g * (serving_qty / 100), 0)
    return {
        "source": source,
        "product": product,
        "analysis": product.nutrition_analysis,
        "ingredient_analysis": product.ingredient_analysis,
        "insights": product.insights,
        "energy": {
            "per_100g": energy_100g,
            "per_serving": energy_per_serving,
        }
    }

