import requests
from typing import Optional
from fastapi import APIRouter, Form, HTTPException, status, Response
from starlette.responses import JSONResponse
from core.config import settings
from enums import GPUEnvironment

router = APIRouter()

DEVICE_URL = "/device"

# GPU 상태 확인 API (Health, CUDA Available, CUDA Usage)

@router.get("/health")
async def health():
    response = requests.get(f"{settings.AI_SERVER_URL}{DEVICE_URL}/health")

    if response.status_code != 200:
        return Response(status_code=response.status_code, content=response.content)

    response_data = response.json()
    return JSONResponse(status_code=status.HTTP_200_OK, content={"data": response_data})

@router.get("/cuda_available")
async def cuda_available():
    response = requests.get(f"{settings.AI_SERVER_URL}{DEVICE_URL}/cuda_available")

    if response.status_code != 200:
        return Response(status_code=response.status_code, content=response.content)

    response_data = response.json()
    return JSONResponse(status_code=status.HTTP_200_OK, content={"data": response_data})

@router.get("/cuda_usage")
async def cuda_usage():
    response = requests.get(f"{settings.AI_SERVER_URL}{DEVICE_URL}/cuda_usage")

    if response.status_code != 200:
        return Response(status_code=response.status_code, content=response.content)

    response_data = response.json()
    return JSONResponse(status_code=status.HTTP_200_OK, content={"data": response_data})

@router.post("/set_device")
async def set_device(device_num: int = Form(...)):  # Form 데이터를 받음
    try:
        # 외부 AI 서버에 폼 데이터를 전송
        response = requests.post(
            f"{settings.AI_SERVER_URL}{DEVICE_URL}/set_device",
            data={"device_num": device_num}  # Form 데이터로 전송
        )

        if response.status_code != 200:
            return Response(status_code=response.status_code, content=response.content)

        response_data = response.json()
        return JSONResponse(status_code=status.HTTP_200_OK, content={"data": response_data})

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))