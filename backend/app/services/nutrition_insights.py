def generate_nutrition_insights(analysis: dict,energy_val:float) -> dict:
    warnings = []
    positives = []

    data_source = analysis.get("per_serving") if analysis.get("serving_quantity") else analysis.get("per_100g", {})

    if energy_val is not None:                    
        density = energy_val / 100.0
        if density > 4.0:
            warnings.append("High energy density (Lots of calories in a small portion)")
        elif density < 1.5:
            positives.append("Low energy density (A high-volume, filling choice for the calories)")

    bad_metrics = {"sugars": "sugar", "fat": "total fat", "saturated_fat": "saturated fat", "salt": "salt", "sodium": "sodium"}
    good_metrics = {"protein": "protein", "fiber": "fiber"}

    for key, label in bad_metrics.items():
        nutrient = data_source.get(key, {})
        level = nutrient.get("level")
        if level == "red":
            warnings.append(f"High {label} content")
        elif level == "green":
            positives.append(f"Low {label}")

    for key, label in good_metrics.items():
        nutrient = data_source.get(key, {})
        level = nutrient.get("level")
        if level == "green":
            positives.append(f"Good source of {label}")
        elif level == "amber":
            positives.append(f"Moderate {label} content")

    all_values = [n.get("value") for n in data_source.values() if isinstance(n, dict)]
    has_missing_data = any(v is None for v in all_values) or len(all_values) < 6

    if len(warnings) >= 3:
        summary = "This product has significant nutritional concerns"
    elif warnings:
        summary = "This product has some nutritional concerns"
    elif has_missing_data and len(positives) == 0:
        summary = "Insufficient data to provide a full nutritional summary"
    elif len(positives) >= 3:
        summary = "This product has excellent nutritional markers"
    else:
        summary = "This product has generally balanced nutrition levels"

    return {"summary": summary, "warnings": warnings, "positives": positives}