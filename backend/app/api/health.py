from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db  
import time

router = APIRouter()

@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Comprehensive health check verifying DB connectivity.
    """
    start_time = time.time()
    health_details = {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "database": "down",
            "api": "up"
        }
    }

    try:
        await db.execute(text("SELECT 1"))
        health_details["services"]["database"] = "up"
    except Exception as e:
        health_details["status"] = "unhealthy"
        raise HTTPException(
            status_code=503, 
            detail=health_details
        )

    health_details["latency_ms"] = round((time.time() - start_time) * 1000, 2)
    return health_details