import httpx


BASE_URL = "https://world.openfoodfacts.org/api/v0/product"


async def fetch_product_from_openfoodfacts(barcode: str) -> dict | None:
    """
    Fetch product data from OpenFoodFacts API.

    Returns parsed product data or None if not found.
    """

    url = f"{BASE_URL}/{barcode}.json"

    headers = {
        # Important: OpenFoodFacts requires a user agent
        "User-Agent": "nutrino/1.0"
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=headers)

        data = response.json()

        # If product not found
        if data.get("status") != 1:
            return None

        product = data["product"]

        nutriments = product.get("nutriments", {})

        return {
            "barcode": barcode,
            "name": product.get("product_name"),
            "brand": product.get("brands"),
            "image_url": product.get("image_url"),
            "nutriscore": product.get("nutriscore_grade"),
            "energy_kcal": nutriments.get("energy-kcal_100g"),
            "fat": nutriments.get("fat_100g"),
            "saturated_fat": nutriments.get("saturated-fat_100g"),
            "sugars": nutriments.get("sugars_100g"),
            "salt": nutriments.get("salt_100g"),
            "protein": nutriments.get("proteins_100g"),
            "fiber": nutriments.get("fiber_100g"),
        }

    except Exception:
        return None