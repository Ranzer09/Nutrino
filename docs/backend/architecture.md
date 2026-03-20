# Architecture

## System Flow

User scans barcode:

→ FastAPI receives request  
→ Check PostgreSQL cache  
→ If miss → call OpenFoodFacts API  
→ Normalize data  
→ Run nutrition analysis  
→ Generate insights  
→ Store in DB  
→ Return response  

---

## Key Components

### API Layer
- FastAPI routes
- Request validation
- Response schemas

### Service Layer
- Nutrition analysis
- Insight generation
- External API calls

### Database Layer
- PostgreSQL
- SQLAlchemy ORM
- Caching products

---

## Design Principles

- Clean architecture
- Separation of concerns
- Typed responses
- Fail-safe external API handling