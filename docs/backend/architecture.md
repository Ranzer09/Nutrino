# Architecture

## System Flow

When a user scans or enters a barcode, the request follows this path:

1. **API Layer** — FastAPI receives the request and applies rate limiting + input validation.
2. **Cache Check** — The system first checks PostgreSQL for an existing product using the barcode.
3. **Smart Refresh Decision** — If the product is missing, expired (after 5 days), analysis version changed, or data is incomplete → trigger refresh.
4. **External Data Fetch** — Calls OpenFoodFacts API to retrieve product details, ingredients, and nutrition values.
5. **Data Processing**:
   - Parses serving size (e.g., "30 g", "250 ml", "1L")
   - Normalizes units
   - Computes per 100g and per serving nutrition values
6. **Analysis Engine**:
   - Nutrition Analysis (WHO daily limits)
   - Ingredient Analysis (severity levels: high/medium for palm oil, maida, HFCS, etc.)
   - Energy calculation (per 100g + per serving)
   - Generates human-readable insights and warnings
7. **Persistence** — Saves/updates the product and analysis in PostgreSQL.
8. **Response** — Returns enriched data including `per_100g`, `per_serving`, energy, insights, and ingredient analysis.

---

## Key Components

### 1. API Layer (`app/api/`)
- FastAPI routers (`products.py`, `health.py`)
- Request validation and rate limiting (10 requests/minute)
- Centralized exception handling with consistent error responses
- Logging middleware for all requests

### 2. Service Layer (`app/services/`)
- `nutrition_analysis.py` — Calculates daily percentages, levels, and per-serving values
- `nutrition_insights.py` — Generates summary, warnings, and positives
- `ingredient_analysis.py` — Detects harmful/positive ingredients with severity levels
- `compute_analysis.py` — Orchestrates the full analysis pipeline

### 3. Utils Layer (`app/utils/`)
- `serving_parser.py` — Smart parsing of serving sizes ("30g", "250ml", "1L", etc.)
- `openfoodfacts_service.py` — Async client with timeout and error handling
- `product_service.py` — CRUD operations with data sanitization
- `cache_service.py` — Smart cache invalidation logic (time + version + data quality)

### 4. Database Layer (`app/db/`)
- PostgreSQL with SQLAlchemy ORM
- `Product` model with JSON fields for flexible analysis storage
- Session management via dependency injection
- Alembic-ready structure

### 5. Core Layer (`app/core/`)
- Configuration management (`Settings` with Pydantic)
- Exception handlers and middleware
- Request logging
- Rate limiter setup

---

## Design Principles

- **Clean Architecture** — Routers remain thin; all business logic lives in services.
- **Separation of Concerns** — Clear boundaries between API, services, utils, and database layers.
- **Fail-Safe Design** — Graceful handling of missing data from OpenFoodFacts, safe NULL handling, and fallback values.
- **Smart Caching** — 5-day expiry + automatic refresh when analysis logic changes (`ANALYSIS_VERSION`).
- **Type Safety** — Strong Pydantic models for all responses.
- **Observability** — Comprehensive request logging and health checks.
- **Docker-First** — Designed to run consistently in containers.

---

## Data Flow Highlights

- **Per Serving First** — When serving size is available, the system prioritizes per-serving calculations.
- **Ingredient Severity** — Palm oil, refined flour, HFCS, etc., are flagged with `high`/`medium` severity.
- **Energy Awareness** — Calories are calculated and returned for both per 100g and per serving.
- **Versioned Analysis** — Changing `ANALYSIS_VERSION` automatically refreshes all cached products.

---
