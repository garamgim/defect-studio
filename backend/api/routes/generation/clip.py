from typing import Optional

import requests
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Response, Form
from starlette.responses import JSONResponse
from core.config import settings
from typing import List

router = APIRouter(
    prefix="/clip"
)

CLIP_URL = "/generation/clip"

@router.post("")
async def clip(model: str = Form("ViT-L-14/openai", description="사용할 모델"),
               images: List[UploadFile] = File(None, description="업로드할 이미지 파일들"),
               mode: Optional[str] = Form(None, description="interrogate 모드 설정. fast/classic/negative"),
               caption: Optional[str] = Form(None, description="이미지 caption을 직접 설정할 경우 적는 prompt"),
               batch_size: Optional[int] = Form(1024, description="한 번에 처리할 수 있는 데이터의 양")):

    form_data = {
        "model": model,
        "mode": mode,
        "caption": caption,
        "batch_size":batch_size
    }

    files = [('images', (image.filename, await image.read(), image.content_type)) for image in images]
    response = requests.post(settings.AI_SERVER_URL + CLIP_URL, files=files, data=form_data)

    if response.status_code != 200:
        return Response(status_code=response.status_code, content=response.content)

    response_data = response.json()

    prompts = response_data.get("prompts")
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"generated_prompts": prompts})