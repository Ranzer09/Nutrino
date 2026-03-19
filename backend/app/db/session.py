from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings


# Load cached settings
settings = get_settings()


# Build database URL safely
password = quote_plus(settings.db_password)

DATABASE_URL = (
    f"postgresql://{settings.db_user}:{password}"
    f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
)


# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=True,
)


# Session factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# FastAPI dependency
def get_db():
    """
    Provides a database session to API routes.

    FastAPI automatically:
    - creates session
    - closes session after request
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()