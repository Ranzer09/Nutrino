import uvicorn
from app.core.config import get_settings

def start_server():
    settings = get_settings()

    is_prod = settings.app_env.lower() == "production"

    print(f"🚀 Starting Nutrino API in {'PRODUCTION' if is_prod else 'DEVELOPMENT'} mode...")
    print(f"   Listening on http://{settings.host}:{settings.port}")

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=not is_prod,
        workers=settings.workers if is_prod else 1,
        log_level="info",
    )


if __name__ == "__main__":
    start_server()