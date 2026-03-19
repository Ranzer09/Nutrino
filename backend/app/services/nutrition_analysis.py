from typing import Optional


# WHO / international guideline daily limits
DAILY_LIMITS = {
    "sugars": 50,          # grams
    "saturated_fat": 20,   # grams
    "fat": 70,             # grams
    "salt": 5              # grams
}


def calculate_percent(value: Optional[float], limit: float) -> Optional[int]:
    """
    Convert nutrient value into % of WHO daily limit.
    """

    if value is None:
        return None

    percent = (value / limit) * 100
    return round(percent)


def traffic_light(value: Optional[float], low: float, high: float) -> str:

    if value is None:
        return "unknown"

    if value <= low:
        return "green"

    if value < high:
        return "amber"

    return "red"


def analyze_nutrient(value: Optional[float], daily_limit: float, low: float, high: float):
    """
    Build structured nutrient analysis.
    """

    return {
        "value": value,
        "percent_daily": calculate_percent(value, daily_limit),
        "level": traffic_light(value, low, high)
    }


def analyze_nutrition(product: dict) -> dict:
    """
    Perform full nutrition analysis using WHO + traffic light rules.
    """

    sugars = product.get("sugars")
    saturated_fat = product.get("saturated_fat")
    fat = product.get("fat")
    salt = product.get("salt")

    return {
        "sugars": analyze_nutrient(
            sugars,
            DAILY_LIMITS["sugars"],
            low=5,
            high=22.5
        ),
        "saturated_fat": analyze_nutrient(
            saturated_fat,
            DAILY_LIMITS["saturated_fat"],
            low=1.5,
            high=5
        ),
        "fat": analyze_nutrient(
            fat,
            DAILY_LIMITS["fat"],
            low=3,
            high=17.5
        ),
        "salt": analyze_nutrient(
            salt,
            DAILY_LIMITS["salt"],
            low=0.3,
            high=1.5
        )
    }