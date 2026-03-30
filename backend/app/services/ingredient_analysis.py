from typing import Dict, List, Optional

# Ingredient categories with severity
INGREDIENT_CATEGORIES = {
    "palm_oil": {
        "severity": "high",
        "aliases": ["palm oil", "palmolein", "palm fat", "vegetable oil (palm)", "palm kernel oil"],
        "message": "Contains palm oil (High in saturated fat)"
    },
    "refined_flour": {
        "severity": "medium",
        "aliases": ["maida", "refined wheat flour", "white flour", "enriched wheat flour"],
        "message": "Contains refined flour/maida (Low fiber)"
    },
    "hfcs": {
        "severity": "high",
        "aliases": ["high fructose corn syrup", "glucose-fructose syrup", "fructose syrup"],
        "message": "Contains high fructose corn syrup (Linked to metabolic issues)"
    },
    "artificial_sweeteners": {
        "severity": "medium",
        "aliases": ["aspartame", "sucralose", "acesulfame k", "saccharin"],
        "message": "Contains artificial sweeteners"
    },
    "trans_fat": {
        "severity": "high",
        "aliases": ["partially hydrogenated", "trans fat", "hydrogenated oil"],
        "message": "Contains trans fats (Avoid)"
    },
    "added_sugar": {
        "severity": "medium",
        "aliases": ["sugar", "sucrose", "glucose", "corn syrup", "dextrose"],
        "message": "Contains added sugars"
    }
}

POSITIVE_INGREDIENTS = {
    "whole_grains": {
        "aliases": ["whole wheat", "whole grain", "wholemeal"],
        "message": "Contains whole grains (Good source of fiber)"
    },
    "oats": {
        "aliases": ["oats", "oatmeal"],
        "message": "Contains oats (Excellent fiber source)"
    },
    "nuts": {
        "aliases": ["almonds", "walnuts", "nuts", "seeds"],
        "message": "Contains nuts/seeds (Healthy fats & protein)"
    }
}


def detect_ingredients(text: Optional[str]) -> Dict:
    """
    Advanced ingredient detection with severity levels and counts.
    """
    if not text:
        return {
            "warnings": [],
            "positives": [],
            "severity_counts": {"high": 0, "medium": 0, "low": 0},
            "total_warnings": 0,
            "total_positives": 0,
            "ingredient_summary": "No ingredient information available"
        }

    text = text.lower()

    warnings: List[Dict] = []
    positives: List[Dict] = []
    severity_counts = {"high": 0, "medium": 0, "low": 0}

    # Detect negative ingredients
    for category, info in INGREDIENT_CATEGORIES.items():
        for alias in info["aliases"]:
            if alias in text:
                warnings.append({
                    "ingredient": category,
                    "severity": info["severity"],
                    "message": info["message"]
                })
                severity_counts[info["severity"]] += 1
                break  

    # Detect positive ingredients
    for category, info in POSITIVE_INGREDIENTS.items():
        for alias in info["aliases"]:
            if alias in text:
                positives.append({
                    "ingredient": category,
                    "message": info["message"]
                })
                break

    total_warnings = len(warnings)
    total_positives = len(positives)

    # Generate summary
    if total_warnings >= 3:
        summary = f"High concern: {total_warnings} problematic ingredients detected"
    elif total_warnings >= 1:
        summary = f"Moderate concern: {total_warnings} problematic ingredient(s)"
    elif total_positives >= 2:
        summary = "Good ingredient profile with natural whole foods"
    else:
        summary = "Neutral ingredient profile"

    return {
        "warnings": warnings,
        "positives": positives,
        "severity_counts": severity_counts,
        "total_warnings": total_warnings,
        "total_positives": total_positives,
        "ingredient_summary": summary
    }