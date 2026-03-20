# API Documentation

## GET /products/{barcode}

### Description

Fetch product details and nutrition analysis.

### Flow

1. Check PostgreSQL cache
2. If not found → fetch from OpenFoodFacts
3. Analyze nutrition using WHO guidelines
4. Return structured response

---

### Response Example

```json
{
  "source": "openfoodfacts",
  "product": {
    "id": 5,
    "barcode": "5449000000996",
    "name": "Coca-Cola Original Taste",
    "brand": "Coca-Cola",
    "image_url": "https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.1035.400.jpg",
    "nutriscore": "e",
    "energy_kcal": 42,
    "fat": 0,
    "saturated_fat": 0,
    "sugars": 10.6,
    "salt": 0,
    "protein": 0,
    "fiber": null,
    "cached_at": "2026-03-20T18:01:57.928025"
  },
  "analysis": {
    "sugars": {
      "value": 10.6,
      "percent_daily": 21,
      "level": "amber"
    },
    "saturated_fat": {
      "value": 0,
      "percent_daily": 0,
      "level": "green"
    },
    "fat": {
      "value": 0,
      "percent_daily": 0,
      "level": "green"
    },
    "salt": {
      "value": 0,
      "percent_daily": 0,
      "level": "green"
    }
  },
  "insights": {
    "summary": "This product has generally good nutrition levels",
    "warnings": [],
    "positives": [
      "Low fat",
      "Low salt"
    ]
  }
}

Status Codes

200 → Success

404 → Product not found

429 → Rate limit exceeded


---