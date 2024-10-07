from fastapi import APIRouter, HTTPException
import os
from core.config import settings
from typing import List
from pathlib import Path
from workers.tasks.model import download_model

router = APIRouter(
    prefix="",
)
@router.get("/{member_id}", response_model=List[str])
async def get_model_names(member_id: str):
    member_dir = os.path.join(settings.OUTPUT_DIR, member_id)

    if not os.path.exists(member_dir):
        raise HTTPException(status_code=404, detail="해당 member에 모델이 없습니다.")

    # model_name 디렉토리 리스트 반환
    model_names = [
        name for name in os.listdir(member_dir)
        if os.path.isdir(os.path.join(member_dir, name))
    ]

    if not model_names:
        raise HTTPException(status_code=404, detail="member_id는 존재하지만, 모델이 존재하지 않습니다.")

    return model_names

@router.get("/{model_name}/download")
async def model_download(model_name: str, member_id: str):
    model_path = Path(settings.OUTPUT_DIR) / member_id / model_name
    # 모델이 존재하는지 확인
    if not model_path.exists():
        return {"error": "Model not found"}

    task = download_model.apply_async(args=[model_name, str(model_path)])
    return {"task_id": task.id}