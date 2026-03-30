import re
from typing import Optional, Tuple

def parse_serving_size(serving_size: Optional[str]) -> Optional[float]:
    """
    Enhanced parser with unit normalization and basic density awareness.
    Returns grams equivalent.
    
    Handles: "30 g", "250 ml", "1L", "One slice (45 g)", "500ml", "2 cookies (50g each)"
    """
    if not serving_size:
        return None

    text = serving_size.strip().lower()

    # Improved regex: captures number + optional unit, handles "500ml" without space
    pattern = r'(\d+(?:\.\d+)?)\s*(g|gram|grams|ml|milliliter|milliliters|l|liter|liters|kg|kilogram)?'
    matches = re.findall(pattern, text)

    if not matches:
        return None

    values = []
    for value_str, unit in matches:
        try:
            value = float(value_str)
            if value > 0:
                unit = (unit or "").strip().lower()
                values.append((value, unit))
        except ValueError:
            continue

    if not values:
        return None

    # Take the largest/most relevant value
    best_value, best_unit = max(values, key=lambda x: x[0])

    if not best_unit:
        return best_value  # assume grams when no unit

    # Unit normalization + density conversion
    if best_unit in ['g', 'gram', 'grams']:
        return best_value
    elif best_unit in ['ml', 'milliliter', 'milliliters']:
        # Basic density: most foods ~1g/ml, but we can improve later
        return best_value  # 1 ml ≈ 1 g for nutrition labeling
    elif best_unit in ['l', 'liter', 'liters']:
        return best_value * 1000
    elif best_unit in ['kg', 'kilogram']:
        return best_value * 1000

    return best_value  # fallback


def normalize_unit(value: Optional[float], unit: Optional[str]) -> Tuple[Optional[float], str]:
    """Normalize any unit to grams and return (value_in_grams, normalized_unit)."""
    if value is None:
        return None, "g"

    unit = (unit or "").strip().lower()
    
    if unit in ['g', 'gram', 'grams']:
        return value, "g"
    elif unit in ['ml', 'milliliter', 'milliliters']:
        return value, "ml"   # keep ml for liquids if needed
    elif unit in ['l', 'liter', 'liters']:
        return value * 1000, "g"
    elif unit in ['kg', 'kilogram']:
        return value * 1000, "g"
    
    return value, "g"  # default