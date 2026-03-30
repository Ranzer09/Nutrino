# Nutrino - Barcode Nutrition Scanner

A full-stack web application that scans barcodes and provides detailed nutrition analysis with WHO-based insights.

## Features

- **Barcode Scanning** — Real-time camera scanner with fallback manual input
- **OpenFoodFacts Integration** — Fetches product data from global database
- **Smart Caching** — 5-day cache with automatic refresh on analysis version change
- **Advanced Nutrition Analysis** — Per 100g + Per Serving calculations
- **Ingredient Analysis** — Detects harmful ingredients with severity levels (High/Medium)
- **Energy Awareness** — Shows calories per serving and per 100g
- **WHO-Based Insights** — Warnings and positives based on daily limits
- **Docker Support** — Easy deployment with docker-compose

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy 2.0 + PostgreSQL
- Pydantic v2
- Alembic (migrations)
- OpenFoodFacts API

**Frontend:**
- React + TypeScript
- Tailwind CSS + shadcn/ui
- React Query (TanStack Query)
- html5-qrcode (barcode scanner)

**DevOps:**
- Docker + Docker Compose
- Rate limiting
- Comprehensive error handling

## Project Structure
Nutrino/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/                # Routers
│   │   ├── core/               # Config, middleware, exceptions
│   │   ├── db/                 # Database session & models
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic models
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Helpers (parser, etc.)
│   │   └── main.py
│   ├── requirements.txt
│   └── run.py
├── web/                        # React Frontend
│   ├── src/
│   └── package.json
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
└── README.md

## Quick Start (Docker)

```bash
# 1. Clone and navigate
git clone <your-repo>
cd Nutrino

# 2. Start all services
docker compose up --build
```

## Access:

Frontend: http://localhost:5173
Backend API: http://localhost:8010/docs
Database: localhost:5432

## API Endpoints

GET /products/{barcode} — Main product lookup
GET /health — Health check
GET / — Welcome message

## Environment Variables
Create .env file in backend:

envAPP_ENV=development
DATABASE_URL=postgresql://username:password@db:5432/db_name
ANALYSIS_VERSION=4
CACHE_DAYS=5

## Development
```Bash
# Backend only
cd backend
uvicorn app.main:app --reload --port 8010

# Frontend only
cd web
npm run dev
```

## Deployment
Ready for:
Render.com
Railway.app
Fly.io