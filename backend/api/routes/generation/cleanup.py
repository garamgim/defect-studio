from typing import List, Optional

import requests
from fastapi import APIRouter
from fastapi import UploadFile, File, HTTPException, status, Response, Form
from starlette.responses import JSONResponse

from core.config import settings
from enums import GPUEnvironment
from utils.s3 import upload_files

router = APIRouter(
    prefix="/cleanup",
)

CLEAN_UP_URL = "/generation/cleanup"


@router.post("/{gpu_env}")
async def cleanup(
        gpu_env: GPUEnvironment,
        images: List[UploadFile] = File(..., description="업로드할 이미지 파일들"),
        masks: List[UploadFile] = File(..., description="업로드할 이미지 파일들의 mask 파일들"),
):
    if gpu_env == GPUEnvironment.local:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="local 버전은 현재 준비중입니다.")

    files = []
    for image in images:
        files.append(('images', (image.filename, await image.read(), image.content_type)))
    for mask in masks:
        files.append(('masks', (mask.filename, await mask.read(), mask.content_type)))

    response = requests.post(settings.AI_SERVER_URL + CLEAN_UP_URL, files=files)

    if response.status_code != 200:
        return Response(status_code=response.status_code, content=response.content)

    response_data = response.json()
    image_list = response_data.get("image_list")
    image_url_list = upload_files(image_list, "cleanup")
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"image_list": image_url_list})
