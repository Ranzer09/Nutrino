import uvicorn
from app.core.config import get_settings

settings = get_settings ()

def start_server():
    is_prod = settings.app_env.lower() == "prod"

    print(f"🚀 Starting in {'PRODUCTION' if is_prod else 'DEVELOPMENT'} mode...")

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=not is_prod,
        workers=settings.workers if is_prod else 1,
        ssl_keyfile="./192.168.0.106+2-key.pem", #Only for testing purpose
        ssl_certfile="./192.168.0.106+2.pem",
    )


if __name__ == "__main__":
    start_server()
