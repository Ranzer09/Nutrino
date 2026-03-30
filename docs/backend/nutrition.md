# Nutrition Analysis Logic

## Overview

The system provides **dual calculations**:
- **Per 100g** (standard reference)
- **Per Serving** (real-world consumption)

All analysis is based on **WHO dietary guidelines** and uses smart serving size parsing (e.g., "30 g", "250 ml", "1L").

---

## Daily Recommended Limits (WHO-based)

| Nutrient          | Daily Limit |
|-------------------|-------------|
| Sugars            | 50g         |
| Saturated Fat     | 20g         |
| Total Fat         | 70g         |
| Salt              | 5g          |
| Protein           | 50g         |
| Fiber             | 30g         |
| Sodium            | 2g          |
| Carbohydrates     | 260g        |

---

## Traffic Light System (Level Calculation)

The system uses **context-aware** coloring:

### Negative Nutrients (lower is better)
- **Green**: < 30% of daily limit
- **Amber**: 30% – 70% of daily limit  
- **Red**: > 70% of daily limit

### Positive Nutrients (higher is better)
- **Green**: ≥ 20% of daily needs per 100g
- **Amber**: 10% – 20%
- **Red**: < 10%

**Note**: Protein and Fiber are treated as **positive** nutrients.

---
