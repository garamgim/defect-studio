from contextlib import asynccontextmanager

import uvicorn
from apscheduler.schedulers.background import BackgroundScheduler
from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

from api.main import api_router
from core.config import settings
from core.db import engine
from models import *
from scheduler import expire_tokens, delete_guests
from schema.logs import GenerationLog
from schema.presets import GenerationPreset


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


# 서버 실행
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
