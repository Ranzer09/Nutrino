from fastapi import Header,HTTPException
from functools import lru_cache
from app.db.database import SessionLocal
from app.core.config import Settings

@lru_cache()
def get_settings():
    return Settings()

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_jwt(token: str = Header(...)):
    if token != 'fake-super-secret-token':
        raise HTTPException(status_code=400, detail='X-Token header invalid')


