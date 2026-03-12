from datetime import datetime, timezone
from typing import Union, Dict, Any
import sys
import uuid

from fastapi import Request
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.exception_handlers import (
    http_exception_handler as fastapi_http_exception_handler,
)
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import IntegrityError

from app.core.logger import logger

class ErrorResponseBuilder:
    """Helper class to build consistent error responses."""
    
    @staticmethod
    def build_error_response(
        status_code: int,
        error_type: str,
        message: str,
        request: Request,
        details: Any = None
    ) -> Dict[str, Any]:
        """
        Build a standardized error response dictionary.
        
        Args:
            status_code: HTTP status code
            error_type: Type of error (e.g., "Bad Request", "Not Found")
            message: Error message
            request: FastAPI request object
            details: Additional error details (optional)
        """
        response = {
            "status": status_code,
            "error": error_type,
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "path": request.url.path,
            "requestId": str(uuid.uuid4())
        }
        
        if details:
            response["details"] = details
            
        return response

async def request_validation_exception_handler(
    request: Request,
    exc: RequestValidationError
) -> JSONResponse:
    """
    Handle validation errors for incoming requests.
    
    Args:
        request: FastAPI request object
        exc: Request validation exception
    
    Returns:
        JSONResponse with detailed validation errors
    """
    logger.debug("Processing request validation exception")
    
    validation_details = [
        {
            "field": ".".join(str(loc) for loc in error["loc"]),
            "issue": error["msg"]
        }
        for error in exc.errors()
    ]
    
    first_error = validation_details[0] if validation_details else None
    message = (
        f"Invalid input: '{first_error['field']}' field is required."
        if first_error
        else "Invalid input."
    )
    
    error_response = ErrorResponseBuilder.build_error_response(
        status_code=400,
        error_type="Bad Request",
        message=message,
        request=request,
        details=validation_details
    )
    
    logger.info("Validation errors: %s", validation_details)
    return JSONResponse(
        status_code=400,
        content=jsonable_encoder(error_response)
    )

async def http_exception_handler(
    request: Request,
    exc: HTTPException
) -> Union[JSONResponse, Response]:
    """
    Handle HTTP exceptions.
    
    Args:
        request: FastAPI request object
        exc: HTTP exception
    
    Returns:
        JSONResponse for common status codes or default FastAPI handler response
    """
    status_mapping = {
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found"
    }
    
    if exc.status_code in status_mapping:
        error_response = ErrorResponseBuilder.build_error_response(
            status_code=exc.status_code,
            error_type=status_mapping[exc.status_code],
            message=exc.detail,
            request=request
        )
        return JSONResponse(
            content=jsonable_encoder(error_response),
            status_code=exc.status_code
        )
    
    logger.debug("Delegating to FastAPI's default http exception handler")
    return await fastapi_http_exception_handler(request, exc)

async def unhandled_exception_handler(
    request: Request,
    exc: Exception
) -> JSONResponse:
    """
    Handle all unhandled exceptions.
    
    Args:
        request: FastAPI request object
        exc: Unhandled exception
    
    Returns:
        JSONResponse with appropriate error details
    """
    # Log request details
    host = getattr(getattr(request, "client", None), "host", None)
    port = getattr(getattr(request, "client", None), "port", None)
    url = (
        f"{request.url.path}?{request.query_params}"
        if request.query_params
        else request.url.path
    )
    
    # Get exception details
    exc_type, exc_value, _ = sys.exc_info()
    exc_name = getattr(exc_type, "__name__", None)
    
    # Log the error
    logger.error(
        f'{host}:{port} - "{request.method} {url}" 500 Internal Server Error '
        f'<{exc_name}: {exc_value}>'
    )
    
    if isinstance(exc, IntegrityError):
        error_message = str(exc.orig)
        logger.error(f"Database IntegrityError: {error_message}")
        
        error_response = ErrorResponseBuilder.build_error_response(
            status_code=409,
            error_type="Conflict",
            message="Database integrity constraint violation",
            request=request,
            details=error_message
        )
        return JSONResponse(content=error_response, status_code=409)
    
    error_response = ErrorResponseBuilder.build_error_response(
        status_code=500,
        error_type="Internal Server Error",
        message="An unexpected error occurred. Please try again later.",
        request=request
    )
    
    return JSONResponse(content=error_response, status_code=500)