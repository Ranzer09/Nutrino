from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database Configuration ---
    db_engine: str
    db_port: str
    db_host: str
    db_user: str
    db_password: str
    db_name: str

    # --- Application Config ---
    # base_dir: str
    secret_key: str
    algorithm: str
    api_key: str

    # # --- S3 Configuration ---
    # s3_access_key: str
    # s3_secret_key: str
    # s3_bucket_name: str
    # aws_region: str

    # --- Runtime / Environment ---
    app_env: str = "dev"  # "dev" or "prod"
    port: int = 8010
    host: str = "0.0.0.0"
    workers: int = 1

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


# ---------------------------------------------------
# Cached settings loader (important)
# ---------------------------------------------------
@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.

    lru_cache ensures:
    - Settings is created once
    - reused everywhere
    """
    return Settings()

APP_CONFIG = dict(
    title="Nutrino",
    description="""
    API for scanning food products and analyzing nutrition.

    Features:
    - Barcode lookup
    - PostgreSQL caching
    - OpenFoodFacts integration
    - WHO-based nutrition analysis
    - Health insights & warnings

    All nutrition values are based on **per 100g of product**.
    """,
    version="1.0.0"
)
