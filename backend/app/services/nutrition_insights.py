def generate_nutrition_insights(analysis: dict) -> dict:
    """
    Generate warnings and positive indicators
    based on nutrition analysis results.
    """

    warnings = []
    positives = []

    sugars = analysis["sugars"]
    fat = analysis["fat"]
    saturated_fat = analysis["saturated_fat"]
    salt = analysis["salt"]

    # -------- WARNINGS --------

    if sugars["level"] == "red":
        warnings.append("High sugar content")

    if saturated_fat["level"] == "red":
        warnings.append("High saturated fat")

    if salt["level"] == "red":
        warnings.append("High salt")

    if fat["level"] == "red":
        warnings.append("High fat")

    # -------- POSITIVE SIGNALS --------

    if sugars["level"] == "green":
        positives.append("Low sugar")

    if fat["level"] == "green":
        positives.append("Low fat")

    if salt["level"] == "green":
        positives.append("Low salt")

    # -------- SUMMARY MESSAGE --------

    if warnings:
        summary = "This product has some nutritional concerns"
    elif (salt['value'] and sugars['value'] and saturated_fat['value'] and fat['value']) == None:
        summary = "Not enough information for summary"
    else:   
        summary = "This product has generally good nutrition levels"

    return {
        "summary": summary,
        "warnings": warnings,
        "positives": positives
    }