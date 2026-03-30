from typing import Dict, Optional
from app.utils.serving_parser import normalize_unit, parse_serving_size   # NEW import

DAILY_LIMITS = {
    "sugars": 50,
    "saturated_fat": 20,
    "fat": 70,
    "salt": 5,
    "protein": 50,
    "fiber": 30,
    "sodium": 2,
    "carbs": 260,
}

def calculate_percent(value: Optional[float], limit: float) -> Optional[float]:
    if value is None or value < 0:
        return None
    return round((value / limit) * 100, 2)

def get_level(percent: Optional[float], nutrient_type: str = "limit") -> str:
    if percent is None:
        return "unknown"
    if nutrient_type in ["protein", "fiber"]:
        return "green" if percent >= 20 else "amber" if percent >= 10 else "red"
    return "green" if percent < 30 else "amber" if percent < 70 else "red"

def build_nutrient(value: Optional[float], limit: float, nutrient_key: str) -> Dict:
    percent = calculate_percent(value, limit)
    return {
        "value": value,
        "percent_daily": percent,
        "limit": limit,
        "level": get_level(percent, nutrient_key),
    }

def calculate_per_serving(value_100g: Optional[float], serving_quantity_grams: Optional[float]) -> Optional[float]:
    """Pure conversion from per-100g to per-serving (in grams)."""
    if value_100g is None or serving_quantity_grams is None or serving_quantity_grams <= 0:
        return None
    factor = serving_quantity_grams / 100.0
    return round(value_100g * factor, 2)


def analyze_nutrition(
    data: Dict[str, Optional[float]], 
    serving_size: Optional[str] = None,
    serving_quantity: Optional[float] = None   
) -> Dict:
    """Full nutrition analysis."""
    
    serving_quantity_grams = parse_serving_size(serving_size)

    # Define the keys we are tracking
    nutrient_keys = ["sugars", "fat", "saturated_fat", "salt", "protein", "fiber", "sodium", "carbs"]
    
    per_100g = {}
    per_serving = {}

    for key in nutrient_keys:
        val_100g = data.get(key)
        limit = DAILY_LIMITS.get(key, 1.0) 

        per_100g[key] = build_nutrient(val_100g, limit, key)

        val_serving = calculate_per_serving(val_100g, serving_quantity_grams)
        
        per_serving[key] = {
            "value": val_serving,
            "percent_daily": None,
            "limit":limit,   
            "level": "unknown"
        }
    normalized_serving, unit = normalize_unit(serving_quantity_grams, "g")
    return {
        "per_100g": per_100g,
        "per_serving": per_serving,
        "serving_quantity": normalized_serving,
        "serving_size": serving_size,
        "serving_unit_parsed": unit,
        "serving_quantity_raw": serving_quantity_grams   # keep original for debugging
    }