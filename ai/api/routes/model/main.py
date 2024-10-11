import io
import os
import json
from celery.result import AsyncResult
from fastapi import APIRouter, status, HTTPException
from starlette.responses import JSONResponse, StreamingResponse
from pathlib import Path
from schema import CeleryTaskResponse
from api.routes.model import model

router = APIRouter(
    prefix="/model",
    tags=["GPU Server Model Related API"]
)

router.include_router(model.router)

@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    result = AsyncResult(task_id)

    if result.status == "PENDING":
        response = CeleryTaskResponse(
            task_status="PENDING",
            message="Task가 실행을 대기하고 있습니다."
        ).model_dump(exclude_none=True)
        return JSONResponse(status_code=status.HTTP_200_OK, content=response)

    elif result.status == "STARTED":
        response = CeleryTaskResponse(
            task_name=result.name,
            task_status=result.status,
            task_arguments=result.kwargs,
            message="Task가 진행중입니다.",
        ).model_dump(exclude_none=True)
        return JSONResponse(status_code=status.HTTP_200_OK, content=response)

    elif result.status == "FAILURE":
        response = CeleryTaskResponse(
            task_name=result.name,
            task_status=result.status,
            task_arguments=result.kwargs,
            result_data_type=type(result.result).__name__,
            result_data=str(result.result)
        ).model_dump(exclude_none=True)

        result.forget()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response)

    elif result.status == "SUCCESS":
        if isinstance(result.result, str) and result.result.endswith(".zip"):
            task_result = result.result
            task_name = result.name
            task_arguments = result.kwargs

            with open(task_result, "rb") as file:
                zip_file = io.BytesIO(file.read())

            zip_filename = f"{Path(task_result).stem}.zip"
            print('zip_filename:', zip_filename)

            os.remove(task_result)
            return StreamingResponse(zip_file, media_type="application/zip",
                                         headers={
                                             "Content-Disposition": f"attachment; filename={zip_filename}",
                                             "Task-Name": task_name,
                                             "Task-Arguments": json.dumps(task_arguments),
                                         })

    else:
        response = CeleryTaskResponse(
            task_status=result.status,
        ).model_dump(exclude_none=True)
        return JSONResponse(status_code=status.HTTP_200_OK, content=response)
