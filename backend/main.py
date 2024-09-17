from contextlib import asynccontextmanager

import uvicorn
from apscheduler.schedulers.background import BackgroundScheduler
from beanie import init_beanie
from celery import Celery
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from redis import Redis
from rq import Queue
from starlette.middleware.cors import CORSMiddleware

from api.main import api_router
from core.config import settings
from core.db import engine
from models import *
from scheduler import expire_tokens, delete_guests


@asynccontextmanager
async def lifespan(app: FastAPI):
    # DB Table 생성 (존재하지 않는 테이블만 생성)
    Base.metadata.create_all(bind=engine)

    # Scheduler 설정
    scheduler = BackgroundScheduler()
    scheduler.add_job(expire_tokens, 'cron', hour=0, minute=0)  # 만료 TokenUsage 삭제 스케줄러
    scheduler.add_job(delete_guests, 'interval', minutes=1)  # 만료 Member(role.guest) 삭제 스케줄러
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
    await init_beanie(database=mongo_database, document_models=[GenerationPreset])

    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

# Managing Redis queues directly with rq
redis_conn = Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
task_queue = Queue("task_queue", connection=redis_conn)

celery = Celery(
    __name__,
    broker=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0",
    backend=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0"
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Authorization", "Content-Length", "Set-Cookie"],
    )


@celery.task
def test_function(x, y):
    import time
    time.sleep(5)
    return x / y


app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
