from fastapi import APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import Depends, HTTPException, status, Query
from starlette.responses import JSONResponse

from crud import token_logs as token_logs_crud
from enums import Role
from functools import wraps
from models import Member
from dependencies import get_db, get_current_user
from datetime import datetime
from api.routes.admin import role_required

router = APIRouter(
    prefix="/statistics",
    tags=["statistics"]
)

@router.get("/tokens/issue")
@role_required([Role.super_admin])
async def get_statistics_tokens_issue(start_date: Optional[datetime] = Query(None),
                                end_date: Optional[datetime] = Query(None),
                                session: Session = Depends(get_db),
                                current_user: Member = Depends(get_current_user)):
    statistics = token_logs_crud.get_statistics_tokens_issue(session, start_date, end_date)
    results = [{"issue_date": record[0].isoformat(), "token_quantity": record[1]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/tokens/usage")
@role_required([Role.super_admin])
async def get_statistics_tokens_usage(filter_type: str = Query(...),
                                      session: Session = Depends(get_db),
                                current_user: Member = Depends(get_current_user)):
    statistics = token_logs_crud.get_statistics_tokens_usage(session, filter_type)
    results = [{"use_date":str(record[0]), "token_quantity": record[1]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)