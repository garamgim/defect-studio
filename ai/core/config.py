from pydantic import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    # ENVIRONMENT
    OUTPUT_DIR: str
    DIFFUSERS_TRAIN_PATH: str

# 환경 변수 로드 및 검증
settings = Settings()
