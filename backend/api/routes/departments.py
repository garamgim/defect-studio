from datetime import datetime

from fastapi import APIRouter
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from dependencies import get_db, get_current_user
from fastapi import Depends, HTTPException, status, Query
from crud import members as members_crud, departments as departments_crud, token_logs as token_logs_crud
from schema.members import MemberReadByDepartment
from models import Member
from typing import List, Optional
from enums import Role
from functools import wraps

router = APIRouter(
    prefix="/departments",
    tags=["departments"]
)

# role decorator
def role_required(allowed_roles: List[Role]):
    def decorator(func):
        @wraps(func)
        async def wrapper(current_user: Member =Depends(get_current_user), *args,  **kwargs):
            if current_user.role not in allowed_roles:
                raise HTTPException(status_code=403, detail="권한이 없습니다.")
            return await func(current_user=current_user, *args, **kwargs)
        return wrapper
    return decorator

@router.get("")
async def get_departments(session: Session = Depends(get_db)):
    return departments_crud.get_departments(session)

@router.get("/{department_id}/members")
async def get_members_by_department(department_id: int,
                                    session: Session = Depends(get_db),
                                    member: Member = Depends(get_current_user)):
    members = members_crud.get_members_by_department_id(session, department_id)
    member_reads = [MemberReadByDepartment.from_orm(member) for member in members]
    return member_reads

@router.get("/{department_id}/members/statistics/images")
@role_required([Role.super_admin, Role.department_admin])
async def get_statistics_images(department_id: int,
                                session: Session = Depends(get_db),
                                current_user: Member = Depends(get_current_user)):

    if current_user.role == Role.department_admin and current_user.department_id != department_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="부서 관리자는 자신의 부서만 조회 가능합니다.")

    statistics = token_logs_crud.get_statistics_images_by_department_id(session, department_id)
    results = [{"member_id":record[0], "member_name":record[1], "image_quantity":record[2]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/{department_id}/statistics/tools")
@role_required([Role.super_admin, Role.department_admin])
async def get_statistics_tools(department_id: int,
                                session: Session = Depends(get_db),
                                current_user: Member = Depends(get_current_user)):
    if current_user.role == Role.department_admin and current_user.department_id != department_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="부서 관리자는 자신의 부서만 조회 가능합니다.")

    statistics = token_logs_crud.get_statistics_tools_by_department_id(session, department_id)
    results = [{"use_type":record[0].value, "usage":record[1]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/{department_id}/statistics/tokens/distributions")
@role_required([Role.super_admin, Role.department_admin])
async def get_statistics_tokens_distributions(department_id: int,
                                start_date: Optional[datetime] = Query(None),
                                end_date: Optional[datetime] = Query(None),
                                session: Session = Depends(get_db),
                                current_user: Member = Depends(get_current_user)):
    if current_user.role == Role.department_admin and current_user.department_id != department_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="부서 관리자는 자신의 부서만 조회 가능합니다.")

    statistics = token_logs_crud.get_statistics_tokens_distributions_by_department_id(session, department_id,
                                                                                      start_date, end_date)
    results = [{"distribute_date": record[0].isoformat(), "token_quantity": record[1]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/{department_id}/members/statistics/tokens/usage")
@role_required([Role.super_admin, Role.department_admin])
async def get_statistics_tokens_usage(department_id: int,
                                      session: Session = Depends(get_db),
                                      current_user: Member = Depends(get_current_user)):
    if current_user.role == Role.department_admin and current_user.department_id != department_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="부서 관리자는 자신의 부서만 조회 가능합니다.")

    statistics = token_logs_crud.get_statistics_tokens_usage_by_department_id(session, department_id)
    results = [{"member_id": record[0], "member_name": record[1], "token_quantity": record[2]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)