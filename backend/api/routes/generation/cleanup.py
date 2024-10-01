from typing import Optional, List

import requests
from fastapi import APIRouter, Form, UploadFile, File, HTTPException, status, Depends

from core.config import settings
from dependencies import get_current_user
from enums import GPUEnvironment, Role
from models import Member

router = APIRouter(
    prefix="/cleanup",
)

CLEAN_UP_URL = "/generation/cleanup"


@router.post("/{gpu_env}")
async def cleanup(
        gpu_env: GPUEnvironment,
        gpu_device: int = Form(..., description="사용할 GPU의 장치 번호"),
        init_image_list: List[UploadFile] = File(..., description="업로드할 이미지 파일들"),
        mask_image_list: List[UploadFile] = File(..., description="업로드할 이미지 파일들의 mask 파일들"),
        current_user: Member = Depends(get_current_user),
        init_input_path: Optional[str] = Form(None, description="초기 이미지를 가져올 로컬 경로", examples=[""]),
        mask_input_path: Optional[str] = Form(None, description="마스킹 이미지를 가져올 로컬 경로", examples=[""]),
        output_path: Optional[str] = Form(None, description="이미지를 저장할 로컬 경로", examples=[""])
):
    if gpu_env == GPUEnvironment.local:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="local 버전은 현재 준비중입니다.")

    cost = len(init_image_list) # 토큰 차감 수
    # 토큰 개수 모자랄 경우 먼저 에러 처리
    if current_user.role != Role.super_admin and current_user.token_quantity < cost:
        raise HTTPException(status_code=400, detail="보유 토큰이 부족합니다.")

    files = []
    for image in init_image_list:
        files.append(('images', (image.filename, await image.read(), image.content_type)))
    for mask in mask_image_list:
        files.append(('masks', (mask.filename, await mask.read(), mask.content_type)))

    form_data = {
        "gpu_device": gpu_device
    }

    json_response = requests.post(settings.AI_SERVER_URL + CLEAN_UP_URL, data=form_data, files=files).json()

    return {"task_id": json_response.get("task_id")}
