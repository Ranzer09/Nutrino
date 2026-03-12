# Main entry point of the FastAPI application

from fastapi import Depends, FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.core.config import APP_CONFIG, Settings
from app.core.exception_handler import http_exception_handler, request_validation_exception_handler, unhandled_exception_handler
from app.core.middleware import log_request_middleware
from app.db.session import get_settings

origins = [
    "*",
]
app = FastAPI(**APP_CONFIG)

app.middleware("http")(log_request_middleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_exception_handler(RequestValidationError, request_validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(health_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/db", tags=["root"])
async def get_db_config():
    """
    Simple debug endpoint to verify DB configuration loaded correctly
    """
    settings = get_settings()
    return {"db_engine": settings.db_engine}


@app.get("/")
async def root():
    """
    Root endpoint
    Useful for verifying server is running.
    """
    return {
        "message": "Welcome to Nutrition Scanner API"
    }