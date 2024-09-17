from typing import Literal

from pydantic import (
    AnyUrl,
    PostgresDsn,
    computed_field,
)
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    # ENVIRONMENT
    BACKEND_DOMAIN: str
    AI_SERVER_URL: str

    # JWT
    ENCODE_ALGORITHM: str
    JWT_SECRET_KEY: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_REFRESH_TOKEN_EXPIRE_MINUTES: int

    # S3
    AWS_S3_BUCKET: str
    AWS_S3_REGION_STATIC: str
    AWS_S3_ACCESS_KEY: str
    AWS_S3_SECRET_KEY: str

    # REDIS
    REDIS_HOST: str
    REDIS_PORT: str

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5500",
    ]

    # DB
    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return URL.create(
            drivername="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            database=self.POSTGRES_DB
        ).render_as_string(hide_password=False)

    # MONGO DB
    MONGO_DB_PORT: int
    MONGO_DB_USERNAME: str
    MONGO_DB_PASSWORD: str

settings = Settings()  # type: ignore
