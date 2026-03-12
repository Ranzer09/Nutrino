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


# Instantiate settings globally
settings = Settings()


APP_CONFIG = dict(
    title="Nutrition Scanner API",
    description="Backend API for Nutrino",
    version="1.0.0"
)
