import time
import http
from fastapi import Request
from app.core.logger import logger


async def log_request_middleware(request: Request, call_next):
    """Log all incoming requests with processing time."""
    url = f"{request.url.path}?{request.query_params}" if request.query_params else request.url.path
    start_time = time.time()

    response = await call_next(request)

    process_time = (time.time() - start_time) * 1000
    formatted_time = f"{process_time:.2f}ms"

    host = getattr(getattr(request, "client", None), "host", "unknown")
    port = getattr(getattr(request, "client", None), "port", "")

    try:
        status_phrase = http.HTTPStatus(response.status_code).phrase
    except ValueError:
        status_phrase = ""

    logger.info(
        f'{host}:{port} - "{request.method} {url}" {response.status_code} {status_phrase} {formatted_time}'
    )

    return response