# Nutrino

Full-stack Product Nutrition Info Scanner built with:

Backend
- FastAPI
- PostgreSQL
- SQLAlchemy 2.x
- Pydantic v2
- alembic

Web
- React
- Vite
- TypeScript
- Tailwind
- TanStack Query

Mobile
- React Native
- Expo
- Barcode Scanner

## Features

Scan product barcode → analyze nutrition levels → show warnings.

## Architecture

Mobile / Web
        |
        v
FastAPI Backend
        |
        v
PostgreSQL Cache
        |
        v
OpenFoodFacts API