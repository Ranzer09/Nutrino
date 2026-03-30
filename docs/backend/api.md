# Nutrino API Documentation

A barcode-based nutrition scanner that provides detailed product information, nutrition analysis, and health insights using OpenFoodFacts and WHO guidelines.

## Base URL
http://localhost:8010

## Endpoints

### 1. GET `/products/{barcode}`

**Description**:  
Main endpoint to fetch product information by barcode. It checks cache first, then fetches from OpenFoodFacts if needed, performs nutrition and ingredient analysis, and returns structured data.

**Path Parameters**:
- `barcode` (string, required) — Numeric barcode (e.g., `5449000000996`)

**Response Structure**:

```json
{
  "source": "cache" | "openfoodfacts" | "refreshed",
  "product": {
    "id": 123,
    "barcode": "5449000000996",
    "name": "Coca-Cola Original Taste",
    "brand": "Coca-Cola",
    "category": "Soft drinks",
    "image_url": "...",
    "nutriscore": "e",
    "energy_kcal": 42,
    "fat": 0,
    "saturated_fat": 0,
    "sugars": 10.6,
    "salt": 0,
    "protein": 0,
    "fiber": null,
    "cached_at": "2026-03-30T12:00:00"
  },
  "analysis": {
    "per_100g": {
      "sugars": { "value": 10.6, "percent_daily": 21.2, "limit": 50, "level": "amber" },
      "fat": { "value": 0, "percent_daily": 0, "limit": 70, "level": "green" },
      "saturated_fat": { "value": 0, "percent_daily": 0, "limit": 20, "level": "green" },
      "salt": { "value": 0, "percent_daily": 0, "limit": 5, "level": "green" },
      "protein": { "value": 0, "percent_daily": 0, "limit": 50, "level": "red" },
      "fiber": { "value": null, "percent_daily": null, "limit": 30, "level": "unknown" }
    },
    "per_serving": { ... },
    "serving_quantity": 250,
    "serving_size": "250 ml",
    "serving_unit_parsed": "ml"
  },
  "energy": {
    "per_100g": 42,
    "per_serving": 105
  },
  "insights": {
    "summary": "This product has some nutritional concerns",
    "warnings": ["High sugar content"],
    "positives": ["Low fat", "Low salt"]
  },
  "ingredient_analysis": {
    "warnings": [
      { "ingredient": "added_sugar", "severity": "medium", "message": "Contains added sugars" }
    ],
    "positives": [],
    "severity_counts": { "high": 0, "medium": 1, "low": 0 },
    "total_warnings": 1,
    "total_positives": 0,
    "ingredient_summary": "Moderate concern: 1 problematic ingredient"
  }
}
```

## Status Codes:

200 — Success
400 — Invalid barcode (must contain only numbers)
404 — Product not found in database or OpenFoodFacts
429 — Rate limit exceeded (10 requests per minute)
503 — Service unhealthy (database connection issue)

### 2. GET /health
**Description**: Basic health check endpoint.
**Response Structure**:
```json
{
  "status": "healthy",
  "timestamp": 1743345623.45,
  "services": {
    "database": "up",
    "api": "up"
  },
  "latency_ms": 12.34
}
```

### 3. GET /
**Description**: Welcome endpoint.
**Response Structure**:
```json
{
  "message": "Welcome to Nutrition Scanner API"
}
```

### Features

Smart Caching: Products are cached for 5 days. Cache is invalidated on analysis version change.
-Per Serving Analysis: Automatically calculates values per serving when serving size is available.
-Ingredient Severity Detection: Detects palm oil, maida, HFCS, artificial sweeteners, etc., with high/medium severity.
-Energy Awareness: Shows calories per 100g and per serving.
-WHO-Based Nutrition: Uses official daily limits for sugar, fat, saturated fat, salt, protein, and fiber.
-Robust Error Handling: Consistent error responses with request IDs.

## Rate Limiting

-10 requests per minute per IP address.