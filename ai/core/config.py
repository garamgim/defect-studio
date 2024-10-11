from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    # ENVIRONMENT
    DOWNLOAD_TEMP_DIR: str
    OUTPUT_DIR: str
    DIFFUSERS_TRAIN_PATH: str
    BASE_MODEL_NAME: str
    MULTI_CONCEPT_TRAIN_PATH: str

    # REDIS
    REDIS_HOST: str
    REDIS_PORT: str

# 환경 변수 로드 및 검증
settings = Settings()
