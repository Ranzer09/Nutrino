from fastapi import Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import IntegrityError
import sys
from datetime import datetime, timezone
import uuid

from app.core.logger import logger


class ErrorResponseBuilder:
    """Helper to build consistent, informative error responses."""

    @staticmethod
    def build(
        status_code: int,
        error_type: str,
        message: str,
        request: Request,
        details: dict | None = None
    ) -> dict:
        return {
            "status": status_code,
            "error": error_type,
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "path": request.url.path,
            "request_id": str(uuid.uuid4()),
            **({"details": details} if details else {})
        }


async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    validation_details = [
        {"field": ".".join(str(loc) for loc in error["loc"]), "message": error["msg"]}
        for error in exc.errors()
    ]

    error_response = ErrorResponseBuilder.build(
        status_code=400,
        error_type="Validation Error",
        message="Invalid input data",
        request=request,
        details=validation_details
    )

    logger.warning("Validation error: %s", validation_details)
    return JSONResponse(status_code=400, content=jsonable_encoder(error_response))


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle standard HTTP exceptions."""
    error_type = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        429: "Too Many Requests",
        500: "Internal Server Error"
    }.get(exc.status_code, "Error")

    error_response = ErrorResponseBuilder.build(
        status_code=exc.status_code,
        error_type=error_type,
        message=str(exc.detail),
        request=request
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(error_response)
    )


async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all for unexpected errors."""
    exc_type = type(exc).__name__

    logger.error(
        f"Unhandled exception: {exc_type}: {exc}",
        exc_info=True
    )

    if isinstance(exc, IntegrityError):
        error_response = ErrorResponseBuilder.build(
            status_code=409,
            error_type="Database Conflict",
            message="Data integrity violation",
            request=request,
            details=str(exc.orig) if hasattr(exc, 'orig') else None
        )
        return JSONResponse(status_code=409, content=jsonable_encoder(error_response))

    error_response = ErrorResponseBuilder.build(
        status_code=500,
        error_type="Internal Server Error",
        message="An unexpected error occurred. Please try again later.",
        request=request
    )

    return JSONResponse(status_code=500, content=jsonable_encoder(error_response))