import requests
from fastapi import APIRouter
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from api.routes.model import model
from dependencies import get_db, get_current_user
from models import Member
from core.config import settings
from starlette.responses import JSONResponse, StreamingResponse

router = APIRouter(
    prefix="/model",
    tags=["model"],

)

router.include_router(model.router)

@router.get("/tasks/{task_id}")
async def get_task_status(
        task_id: str,
        member: Member = Depends(get_current_user),
        session: Session = Depends(get_db),
):
    response = requests.get(settings.AI_SERVER_URL + f"/model/tasks/{task_id}", stream=True)

    if response.headers['content-type'] == "application/json":
        response = response.json()
        return response

    elif response.status_code == 200 and response.headers.get("Content-Type") == "application/zip":
        content_disposition = response.headers.get("Content-Disposition", "")
        filename = content_disposition.split("filename=")[
            -1].strip() if "filename=" in content_disposition else "output.zip"

        return StreamingResponse(
            response.raw,
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )