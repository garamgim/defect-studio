import io
import random
import zipfile
from typing import Optional, List

import requests
from fastapi import APIRouter, status, Response, Form, UploadFile, File, HTTPException, Depends
from starlette.responses import JSONResponse
from dependencies import get_current_user
from models import Member

from pathlib import Path
from core.config import settings
from enums import GPUEnvironment, SchedulerType
from utils.s3 import upload_files

router = APIRouter(
    prefix="/img-to-img",
)

base_models = settings.BASE_MODEL_NAME.split("|")

@router.post("/{gpu_env}")
async def image_to_image(
        gpu_env: GPUEnvironment,  # GPU 환경 정보
        current_user: Member = Depends(get_current_user),
        model: str = Form(base_models[0]),
        scheduler: Optional[SchedulerType] = Form(None, description="각 샘플링 단계에서의 노이즈 수준을 제어할 샘플링 메소드"),
        prompt: str = Form(..., description="이미지를 생성할 텍스트 프롬프트"),
        negative_prompt: Optional[str] = Form(None, description="네거티브 프롬프트로 작용할 텍스트", examples=[""]),
        width: Optional[int] = Form(512),
        height: Optional[int] = Form(512),
        num_inference_steps: Optional[int] = Form(50, ge=1, le=100, description="추론 단계 수"),
        guidance_scale: Optional[float] = Form(7.5, ge=1.0, le=20.0,
                                               description="모델이 텍스트 프롬프트에 얼마나 충실하게 이미지를 생성할지에 대한 수치 (0.0=프롬프트 벗어남, 10.0=프롬프트를 강하게 따름)"),
        strength: Optional[float] = Form(0.5, ge=0.0, le=1.0,
                                         description="초기 이미지와 얼마나 다르게 생성할지에 대한 수치 (0.0=초기 이미지 유지, 1.0=초기 이미지 무관)"),
        seed: Optional[int] = Form(-1, description="이미지 생성 시 사용할 시드 값 (랜덤 시드: -1)"),
        batch_count: Optional[int] = Form(1, ge=1, le=10, description="호출할 횟수"),
        batch_size: Optional[int] = Form(1, ge=1, le=10, description="한 번의 호출에서 생성할 이미지 수"),
        image_list: List[UploadFile] = File(..., description="초기 이미지 파일들"),
        input_path: Optional[str] = Form(None, description="이미지를 가져올 로컬 경로", examples=[""]),
        output_path: Optional[str] = Form(None, description="이미지를 저장할 로컬 경로", examples=[""])
):
    if gpu_env == GPUEnvironment.local:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="local 버전은 현재 준비중입니다.")

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
        "scheduler": scheduler.value if scheduler else None,
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "num_inference_steps": num_inference_steps,
        "guidance_scale": guidance_scale,
        "strength": strength,
        "seed": seed,
        "batch_count": batch_count,
        "batch_size": batch_size,
    }

    files = [('images', (image.filename, await image.read(), image.content_type)) for image in image_list]
    response = requests.post(settings.AI_SERVER_URL + "/generation/img-to-img", files=files, data=form_data)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    # Response 데이터를 메모리 내 ZIP 파일 형태로 처리할 수 있도록 변환
    zip_file_bytes = io.BytesIO(response.content)

    # ZIP 파일에서 이미지 추출하기
    image_list = []
    with zipfile.ZipFile(zip_file_bytes) as zip_file:
        for name in zip_file.namelist():
            image_data = zip_file.read(name)
            image_stream = io.BytesIO(image_data)
            image_list.append(image_stream)

    image_url_list = upload_files(image_list, "iti")

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"image_list": image_url_list}
    )
