# Nutrino Backend Docs

## Overview

This backend powers the Nutrino app.

### Features

- Barcode-based product lookup
- PostgreSQL caching layer
- OpenFoodFacts API integration
- WHO-based nutrition analysis
- Traffic light system (green / amber / red)
- Nutrition insights (warnings + positives)

---

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy 2.x
- Pydantic v2

---

## Base URL
http://127.0.0.1:8010


---

## API Docs

Swagger UI:

/docs


---

## Important Note

All nutrition values are calculated **per 100g of product** for consistency and comparison.

---

## Running the Project

python run.py

---

