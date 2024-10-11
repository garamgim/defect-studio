import io
import json
import zipfile
from datetime import datetime

import requests
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from api.routes.members import use_tokens
from api.routes.training import dreambooth
from core.config import settings
from dependencies import get_db, get_current_user
from enums import UseType
from models import Member
from schema.logs import GenerationLog, SimpleGenerationLog
from schema.tokens import TokenUse
from utils.s3 import upload_files_async

router = APIRouter(
    prefix="/training",
    tags=["training"]
)

router.include_router(dreambooth.router)

@router.get("/tasks/{task_id}")
async def get_task_status(
        task_id: str,
        member: Member = Depends(get_current_user),
        session: Session = Depends(get_db),
):
    response = requests.get(settings.AI_SERVER_URL + f"/training/tasks/{task_id}").json()

    if response.get("task_status") == "SUCCESS":
        task_arguments = response.get("task_arguments")
        cost = int(task_arguments.get("cost"))
        model = task_arguments.get("model")

        token_use = TokenUse(
            cost=cost,
            use_type=UseType.training,
            image_quantity=cost,
            model=model
        )

        use_tokens(token_use, session, member)

    return response