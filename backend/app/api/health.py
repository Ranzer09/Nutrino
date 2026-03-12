from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Simple endpoint to verify the API is running.
    """
    return {
        "status": "ok",
        "message": "Nutrition Scanner API is running"
    }