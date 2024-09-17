from typing import Optional, List

import requests
from fastapi import APIRouter, status, Response, Form, UploadFile, File, HTTPException
from starlette.responses import JSONResponse

from core.config import settings
from enums import GPUEnvironment, SchedulerType
from utils.s3 import upload_files

router = APIRouter(
    prefix="/img-to-img",
)


@router.post("/{gpu_env}")
async def image_to_image(
        gpu_env: GPUEnvironment,  # GPU 환경 정보
        model: str = Form("CompVis/stable-diffusion-v1-4"),
        scheduler: Optional[SchedulerType] = Form(None, description="각 샘플링 단계에서의 노이즈 수준을 제어할 샘플링 메소드"),
        prompt: str = Form(..., description="이미지를 생성할 텍스트 프롬프트"),
        negative_prompt: Optional[str] = Form(None, description="네거티브 프롬프트로 작용할 텍스트"),
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
        images: List[UploadFile] = File(..., description="초기 이미지 파일들"),
        input_path: Optional[str] = Form(None, description="이미지를 가져올 로컬 경로"),
        output_path: Optional[str] = Form(None, description="이미지를 저장할 로컬 경로")
):
    if gpu_env == GPUEnvironment.local:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="local 버전은 현재 준비중입니다.")

    form_data = {
        "model": model,
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

    files = [('images', (image.filename, await image.read(), image.content_type)) for image in images]
    response = requests.post(settings.AI_SERVER_URL + "/generation/img-to-img", files=files, data=form_data)

    if response.status_code != 200:
        return Response(status_code=response.status_code, content=response.content)

    response_data = response.json()
    image_list = response_data.get("image_list")
    image_url_list = upload_files(image_list, "iti")

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"image_list": image_url_list}
    )
