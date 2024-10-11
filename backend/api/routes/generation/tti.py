import random
from pathlib import Path
from typing import Optional

import requests
from fastapi import APIRouter, status, HTTPException, Form, Depends

from core.config import settings
from dependencies import get_current_user
from enums import GPUEnvironment, SchedulerType, Role
from models import Member

router = APIRouter(
    prefix="/txt-to-img",
)

base_models = settings.BASE_MODEL_NAME.split("|")

@router.post("/{gpu_env}")
def text_to_image(
        gpu_env: GPUEnvironment,
        gpu_device: int = Form(..., description="사용할 GPU의 장치 번호"),
        current_user: Member = Depends(get_current_user),
        model: str = Form(base_models[0]),
        scheduler: Optional[SchedulerType] = Form(None, description="각 샘플링 단계에서의 노이즈 수준을 제어할 샘플링 메소드"),
        prompt: str = Form(..., description="이미지를 생성할 텍스트 프롬프트"),
        negative_prompt: Optional[str] = Form(None, examples=[""]),
        width: Optional[int] = Form(512),
        height: Optional[int] = Form(512),
        num_inference_steps: Optional[int] = Form(50, ge=1, le=100, description="추론 단계 수"),
        guidance_scale: Optional[float] = Form(7.5, ge=1.0, le=20.0, description="모델이 텍스트 프롬프트에 얼마나 충실하게 이미지를 생성할지에 대한 수치"),
        seed: Optional[int] = Form(-1, description="이미지 생성 시 사용할 시드 값 (랜덤 시드: -1)"),
        batch_count: Optional[int] = Form(1, ge=1, description="호출할 횟수"),
        batch_size: Optional[int] = Form(1, ge=1, description="한 번의 호출에서 생성할 이미지 수"),
        output_path: Optional[str] = Form(None, description="이미지를 저장할 로컬 경로", examples=[""])
):
    if gpu_env == GPUEnvironment.local:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="local 버전은 현재 준비중입니다.")

    cost = batch_count * batch_size
    # 토큰 개수 모자랄 경우 먼저 에러 처리
    if current_user.role != Role.super_admin and current_user.token_quantity < cost:
        raise HTTPException(status_code=400, detail="보유 토큰이 부족합니다.")

    member_id = current_user.member_id
    model_name = model

    if model_name in base_models:
        model_path = model_name
    else:
        # TODO 해당 member_id에 존재하는 모델인지 검증 로직 필요
        model_path = Path(str(member_id)) / model_name

    if seed == -1:
        seed = random.randint(0, 2 ** 32 - 1)

    form_data = {
        "model": model_path,
        "gpu_device": gpu_device,
        "scheduler": scheduler.value if scheduler else None,
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "num_inference_steps": num_inference_steps,
        "guidance_scale": guidance_scale,
        "seed": seed,
        "batch_count": batch_count,
        "batch_size": batch_size,
        "output_path": output_path,
    }

    json_response = requests.post(settings.AI_SERVER_URL + "/generation/txt-to-img", data=form_data).json()

    return {"task_id": json_response.get("task_id")}
