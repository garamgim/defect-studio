from typing import Iterator

import requests
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.responses import StreamingResponse

from api.routes.model import model
from core.config import settings
from dependencies import get_db, get_current_user
from models import Member

router = APIRouter(
    prefix="/model",
    tags=["model"],

)

router.include_router(model.router)


@router.get("/tasks/{task_id}")
async def get_task_status(
        task_id: str
):
    response = requests.get(settings.AI_SERVER_URL + f"/model/tasks/{task_id}", stream=True)

    if response.headers['content-type'] == "application/json":
        response = response.json()
        return response

    elif response.headers['content-type'] == "application/zip":
        content_disposition = response.headers["content-disposition"]
        filename = content_disposition.split("filename=")[-1].rstrip()

        return StreamingResponse(
            iter_stream(response.raw),
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )


def iter_stream(response_raw) -> Iterator[bytes]:
    chunk_size = 8192  # 8 KB
    while True:
        chunk = response_raw.read(chunk_size)
        if not chunk:
            break
        yield chunk