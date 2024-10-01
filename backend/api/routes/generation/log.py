from fastapi import APIRouter, Depends, status, HTTPException
from starlette.responses import Response

from dependencies import get_current_user
from models import Member
from schema.logs import *
from utils.s3 import delete_files_async
router = APIRouter(
    prefix="/log",
)

@router.get("")
async def get_log_list(
        member: Member = Depends(get_current_user)
):
    logs = await GenerationLog.find(GenerationLog.member_id == member.member_id).to_list()

    simple_logs = [SimpleGenerationLog.from_orm(log) for log in logs]

    data = {
        "logs": simple_logs
    }
    return data

@router.get("/{log_id}")
async def get_log_by_id(
        log_id: PydanticObjectId,
        member: Member = Depends(get_current_user)
):
    log = await GenerationLog.get(log_id)

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="해당 ID의 Log를 찾을 수 없습니다."
        )

    if log.member_id != member.member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="자기 자신의 Log만 조회할 수 있습니다."
        )

    return log

@router.delete("/{log_id}")
async def delete_log(
        log_id: PydanticObjectId,
        member: Member = Depends(get_current_user)
):
    log = await GenerationLog.get(log_id)

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="해당 ID의 log을 찾을 수 없습니다."
        )

    if log.member_id != member.member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="자기 자신의 log만 삭제할 수 있습니다."
        )

    # 해당 로그에 포함된 이미지들 S3에서 삭제
    await delete_files_async(log.image_url_list)

    await log.delete()

    return Response(status_code=status.HTTP_204_NO_CONTENT)