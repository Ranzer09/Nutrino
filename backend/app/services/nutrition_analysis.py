def traffic_light(value: float | None, low: float, high: float):
    """
    Generic traffic light evaluator.
    """

    if value is None:
        return "unknown"

    if value <= low:
        return "green"

    if value <= high:
        return "amber"

    return "red"


def analyze_nutrition(product: dict) -> dict:
    """
    Analyze nutrition values and assign traffic light colors.
    """

    sugars = product.get("sugars")
    saturated_fat = product.get("saturated_fat")
    fat = product.get("fat")
    salt = product.get("salt")

    return {
        "sugars_level": traffic_light(sugars, 5, 22.5),
        "saturated_fat_level": traffic_light(saturated_fat, 1.5, 5),
        "fat_level": traffic_light(fat, 3, 17.5),
        "salt_level": traffic_light(salt, 0.3, 1.5),
    }