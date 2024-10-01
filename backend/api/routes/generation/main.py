import io
import json
import zipfile
from datetime import datetime

import requests
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from api.routes.generation import tti, iti, inpainting, rembg, cleanup, clip, preset, log
from api.routes.members import use_tokens
from core.config import settings
from dependencies import get_db, get_current_user
from enums import SchedulerType
from enums import UseType
from models import Member
from schema.logs import GenerationLog, SimpleGenerationLog
from schema.tokens import TokenUse
from utils.s3 import upload_files_async

router = APIRouter(
    prefix="/generation",
    tags=["generation"]
)

router.include_router(tti.router)
router.include_router(iti.router)
router.include_router(inpainting.router)
router.include_router(rembg.router)
router.include_router(cleanup.router)
router.include_router(clip.router)
router.include_router(preset.router)
router.include_router(log.router)


@router.get("/schedulers")
def get_scheduler_list():
    return [scheduler.value for scheduler in SchedulerType]


@router.get("/tasks/{task_id}")
async def get_task_status(
        task_id: str,
        member: Member = Depends(get_current_user),
        session: Session = Depends(get_db),
):
    response = requests.get(settings.AI_SERVER_URL + f"/generation/tasks/{task_id}")

    if response.headers['content-type'] == "application/json":
        response = response.json()

        if response.get("task_status") == "SUCCESS" and response.get("task_name") == "clip":
            token_use = TokenUse(
                cost=1,
                use_type=UseType.clip,
                image_quantity=1,
                model=response.get("task_arguments").get("model")
            )

            use_tokens(token_use, session, member)

        return response

    elif response.headers['content-type'] == "application/zip":
        zip_file_bytes = io.BytesIO(response.content)

        # ZIP 파일에서 이미지 추출
        image_list = []
        with zipfile.ZipFile(zip_file_bytes) as zip_file:
            for name in zip_file.namelist():
                image_data = zip_file.read(name)
                image_stream = io.BytesIO(image_data)
                image_list.append(image_stream)

        now = datetime.now()
        formatted_date = now.strftime("%Y%m%d")
        formatted_time = now.strftime("%H%M%S%f")

        # S3에 이미지 업로드
        image_url_list = await upload_files_async(image_list, formatted_date, formatted_time)

        # Log 생성
        task_name = response.headers['Task-Name']
        task_args = json.loads(response.headers['Task-Arguments'])

        log = GenerationLog(
            generation_type=task_name,
            member_id=member.member_id,
            date=now,
            num_of_generated_images=len(image_url_list),
            image_url_list=image_url_list,
            **task_args
        )

        saved_log = await log.insert()
        simple_saved_log = SimpleGenerationLog.from_orm(saved_log)

        # 토큰 차감
        token_use = TokenUse(
            cost=len(image_url_list),
            use_type=UseType(task_name),
            image_quantity=len(image_url_list),
            model=task_args.get("model")
        )

        use_tokens(token_use, session, member)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "task_name": task_name,
                "task_status": "SUCCESS",
                "result_data_type": "image",
                "result_data_log": json.loads(simple_saved_log.model_dump_json()),
                "result_data": image_url_list
            }
        )
