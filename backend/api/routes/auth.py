import json
from datetime import datetime, timedelta, timezone
from typing import Annotated

from aioredis import Redis
from alembic.util import status
from fastapi import APIRouter
from fastapi import HTTPException, Response, status, Request
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from crud import members as members_crud
from core.config import settings
from core.security import verify_password, create_access_token, create_refresh_token, decode_refresh_token
from dependencies import get_db, get_redis
from enums import Role

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                session: Session = Depends(get_db)):
    member = authentication_member(form_data.username, form_data.password, session)
    if not member:
        raise HTTPException(status_code=401, detail="아이디나 비밀번호가 일치하지 않습니다.")

    if member.role == Role.guest:
        raise HTTPException(status_code=403, detail="관리자 승인이 필요합니다.")

    response = create_response_with_tokens(member.login_id)
    return response


@router.post("/logout")
async def logout(request: Request, response: Response, redis: Redis = Depends(get_redis)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="이미 로그아웃 된 상태입니다.")
    decoded_refresh_token = decode_refresh_token(refresh_token)
    expiration_datetime = datetime.fromtimestamp(decoded_refresh_token.get("expiration_time"))
    await redis.setex(refresh_token, int((expiration_datetime - datetime.utcnow()).total_seconds()), "blacklisted")
    response.delete_cookie("refresh_token")


@router.post("/reissue")
async def reissue(request: Request, redis: Redis = Depends(get_redis)):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="리프레시 토큰이 존재하지 않습니다.")

    blacklisted = await redis.get(refresh_token)
    if blacklisted:
        raise HTTPException(status_code=401, detail="만료된 Refresh 토큰입니다.")

    decoded_refresh_token = decode_refresh_token(refresh_token)
    login_id = decoded_refresh_token.get("login_id")

    # 기존 토큰은 blacklist 처리
    expiration_datetime = datetime.fromtimestamp(decoded_refresh_token.get("expiration_time"))
    await redis.setex(refresh_token, int((expiration_datetime - datetime.utcnow()).total_seconds()), "blacklisted")

    # refresh token, access token을 모두 새로 발급
    response = create_response_with_tokens(login_id)

    return response


def authentication_member(login_id: str, password: str, session: Session = Depends(get_db)):
    member = members_crud.get_member_by_login_id(session, login_id)
    if not member:
        raise HTTPException(status_code=404, detail="해당 유저를 찾을 수 없습니다.")
    if not verify_password(password, member.password):
        raise HTTPException(status_code=401, detail="비밀번호가 일치하지 않습니다.")
    return member


def create_response_with_tokens(login_id: str):
    access_token = create_access_token(login_id)
    refresh_token = create_refresh_token(login_id)

    headers = {"Authorization": f"Bearer {access_token}"}

    response = JSONResponse(status_code=status.HTTP_200_OK, headers=headers, content={"access_token": access_token, "token_type": "bearer"})

    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRE_MINUTES)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=expiration_time,
        httponly=True,
        secure=True,
        samesite="None"
    )

    return response
