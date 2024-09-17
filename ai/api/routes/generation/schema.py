from typing import Optional

from pydantic import BaseModel, Field


class ITIRequestForm(BaseModel):
    model: str = Field("CompVis/stable-diffusion-v1-4")

    # 프롬프트
    prompt: str = Field(..., description="이미지를 생성할 텍스트 프롬프트")
    negative_prompt: Optional[str] = Field(None)

    # 추론
    num_inference_steps: Optional[int] = Field(50, ge=1, le=100, description="추론 단계 수")
    guidance_scale: Optional[float] = Field(7.5, ge=1.0, le=20.0, description="모델이 텍스트 프롬프트에 얼마나 충실하게 이미지를 생성할지에 대한 수치 (10.0=프롬프트를 강하게 따름, 0.0=프롬프트 벗어남)")
    strength: Optional[float] = Field(0.5, ge=0.0, le=1.0, description="초기 이미지와 얼마나 다르게 생성할지에 대한 수치 (1.0=초기 이미지 무관, 0.0=초기 이미지 유지)")

    # 이미지 갯수
    num_images_per_prompt: Optional[int] = Field(1)
    batch_count: Optional[int] = Field(1, ge=1, le=10, description="호출할 횟수")
    batch_size: Optional[int] = Field(1, ge=1, le=10, description="한 번의 호출에서 생성할 이미지 수")
