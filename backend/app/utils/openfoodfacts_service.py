import httpx
from typing import Dict, Any, Optional

from app.services.ingredient_analysis import detect_ingredients

BASE_URL = "https://world.openfoodfacts.org/api/v0/product"


async def fetch_product_from_openfoodfacts(barcode: str) -> Optional[Dict[str, Any]]:
    """
    Fetch product data from OpenFoodFacts API.
    """
    if not barcode.isdigit():
        return None

    url = f"{BASE_URL}/{barcode}.json"

    headers = {
        "User-Agent": "nutrino/1.0"
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=headers)

            if response.status_code != 200:
                return None

            data = response.json()

    except httpx.TimeoutException:
        return None 
    except httpx.RequestError:
        return None 
    except Exception:
        return None  
    
    if data.get("status") != 1:
        return None

    product = data.get("product", {})
    nutriments = product.get("nutriments", {})

    ingredients_text = product.get("ingredients_text")
    ingredient_analysis = detect_ingredients(ingredients_text)
    
    def get_float(value):
        try:
            return float(value) if value is not None else None
        except (ValueError, TypeError):
            return None
    print(get_float(nutriments.get("serving_quantity")))

    return {
        "barcode": barcode,
        "name": product.get("product_name"),
        "brand": product.get("brands"),
        "category": product.get("categories"),
        "image_url": product.get("image_url"),
        "nutriscore": product.get("nutriscore_grade"),

        "ingredients_text": ingredients_text,
        "ingredient_analysis": ingredient_analysis,

        "energy_kcal": get_float(nutriments.get("energy-kcal_100g")),
        "fat": get_float(nutriments.get("fat_100g")),
        "saturated_fat": get_float(nutriments.get("saturated-fat_100g")),
        "sugars": get_float(nutriments.get("sugars_100g")),
        "salt": get_float(nutriments.get("salt_100g")),
       "protein": get_float(nutriments.get("proteins_100g")),
        "fiber": get_float(nutriments.get("fiber_100g")),
        "sodium": get_float(nutriments.get("sodium_100g")),
        "carbs": get_float(nutriments.get("carbohydrates_100g")),

        "serving_size": product.get("serving_size"),
        "serving_quantity": get_float(product.get("serving_quantity")),
    }