from contextlib import asynccontextmanager

import sentry_sdk
import uvicorn
from apscheduler.schedulers.background import BackgroundScheduler
from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from starlette.middleware.cors import CORSMiddleware

from api.main import api_router
from core.config import settings
from core.db import engine
from models import *
from scheduler import expire_tokens, delete_guests
from schema.presets import GenerationPreset
from schema.logs import GenerationLog


# 생명주기 설정

@asynccontextmanager
async def lifespan(app: FastAPI):
    # DB Table 생성 (존재하지 않는 테이블만 생성)
    Base.metadata.create_all(bind=engine)

    # Scheduler 설정
    scheduler = BackgroundScheduler()
    scheduler.add_job(expire_tokens, 'cron', hour=0, minute=0)  # 만료 TokenUsage 삭제 스케줄러
    scheduler.add_job(delete_guests, 'cron', hour=0, minute=0)  # 만료 Member(role.guest) 삭제 스케줄러
    scheduler.start()

    # Mongo DB 연결
    client = AsyncIOMotorClient(
        "mongodb://%s:%s@%s:%s" % (
            settings.MONGO_DB_USERNAME,
            settings.MONGO_DB_PASSWORD,
            settings.BACKEND_DOMAIN,
            settings.MONGO_DB_PORT
        )
    )

    mongo_database = client.get_database("defectstudio")
    await init_beanie(database=mongo_database, document_models=[GenerationPreset, GenerationLog])

    yield
    scheduler.shutdown()


# FastAPI Application 생성 및 설정

app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix="/api")


# CORS 설정

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Authorization", "Content-Length", "Set-Cookie"],
    )


# Sentry 설정

def before_send(event, hint):
    # 이벤트에 태그를 추가
    event["tags"] = {
        "server_type": "backend",
    }
    return event

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
    before_send=before_send,  # 이벤트가 전송되기 전에 태그를 추가
    integrations=[
        StarletteIntegration(
            transaction_style="endpoint",
            # Http status 300~599 까지 전송
            failed_request_status_codes=[range(300, 599)],
        ),
        FastApiIntegration(
            transaction_style="endpoint",
            failed_request_status_codes=[range(300, 599)],
        ),
    ]
)


# 서버 실행

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
