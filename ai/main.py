import uvicorn
import time
import torch
from fastapi import FastAPI
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from starlette.middleware.base import BaseHTTPMiddleware
from core.config import settings

from api.routes.main import api_router

app = FastAPI()

class TimerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        print(f"Request processing time: {process_time} seconds")
        return response

app.add_middleware(TimerMiddleware)

# 메모리 누스 해결 미들웨어 클래스 정의
class CustomMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        try:
            # 요청이 처리되기 전에 실행할 작업
            print("Request received")

            # 다음 미들웨어 또는 라우터로 요청을 전달
            response = await call_next(request)

            return response

        finally:
            # 요청이 끝난 후, CUDA 메모리 해제
            if torch.cuda.is_available():
                torch.cuda.empty_cache()  # GPU 메모리 캐시 비우기
                print("CUDA memory cleared")

# 미들웨어 추가
app.add_middleware(CustomMiddleware)

def before_send(event, hint):
    # 이벤트에 태그를 추가
    event["tags"] = {
        "server_type": "ai",
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
            failed_request_status_codes=[range(300, 599)],
        ),
        FastApiIntegration(
            transaction_style="endpoint",
            failed_request_status_codes=[range(300, 599)],
        ),
    ]
)

# torch.cuda.set_device(1)

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9755)

