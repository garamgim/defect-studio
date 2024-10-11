from typing import Optional

import requests
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Response, Form, Depends
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from api.routes.members import use_tokens
from core.config import settings
from typing import List

from dependencies import get_db, get_current_user
from enums import UseType, Role
from models import Member
from schema.tokens import TokenUse

router = APIRouter(
    prefix="/clip"
)

CLIP_URL = "/generation/clip"

@router.post("")
async def clip(model: str = Form("ViT-L-14/openai", description="사용할 모델"),
               gpu_device: int = Form(..., description="사용할 GPU의 장치 번호"),
               image_list: List[UploadFile] = File(None, description="업로드할 이미지 파일들"),
               mode: Optional[str] = Form(None, description="interrogate 모드 설정. fast/classic/negative", examples=[""]),
               caption: Optional[str] = Form(None, description="이미지 caption을 직접 설정할 경우 적는 prompt", examples=[""]),
               batch_size: Optional[int] = Form(1024, description="한 번에 처리할 수 있는 데이터의 양"),
               session: Session = Depends(get_db),
               current_user: Member = Depends(get_current_user)):

    cost = 1  # 토큰 차감 수
    # 토큰 개수 모자랄 경우 먼저 에러 처리
    if current_user.role != Role.super_admin and current_user.token_quantity < cost:
        raise HTTPException(status_code=400, detail="보유 토큰이 부족합니다.")

    form_data = {
        "model": model,
        "gpu_device": gpu_device,
        "mode": mode,
        "caption": caption,
        "batch_size":batch_size
    }

    files = [('images', (image.filename, await image.read(), image.content_type)) for image in image_list]

    json_response = requests.post(settings.AI_SERVER_URL + CLIP_URL, files=files, data=form_data).json()

    return {"task_id": json_response.get("task_id")}