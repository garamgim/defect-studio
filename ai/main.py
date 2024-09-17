import uvicorn
import time
import torch
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware

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


app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9755)

