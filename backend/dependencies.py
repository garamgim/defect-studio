from typing import Annotated

import aioredis
from aioredis import Redis
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError, ExpiredSignatureError

from models import Member
from core.db import Session
from core.config import settings

# Access 토큰만을 리턴
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='api/auth/login')


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


async def get_redis() -> Redis:
    redis = await aioredis.from_url(
    f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}",
        decode_responses=False
    )
    try:
        yield redis
    finally:
        await redis.close()


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)], session: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ENCODE_ALGORITHM])
        login_id: str = payload.get('sub')
        token_category: str = payload.get('category')

        if not login_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='유효하지 않은 토큰입니다.')

        if token_category != 'access':
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='올바르지 않은 유형의 토큰입니다.')

        member = session.query(Member).filter(Member.login_id == login_id).first()

        if not member:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail='존재하지 않는 유저입니다.')

        return member

    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='만료된 Access 토큰입니다.')

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='유효하지 않은 토큰입니다.')
