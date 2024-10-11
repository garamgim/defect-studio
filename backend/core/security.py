from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext
from fastapi import HTTPException, status
from jose import jwt, JWTError, ExpiredSignatureError

from core.config import settings

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def verify_password(plain_password, hashed_password):
    return bcrypt_context.verify(plain_password, hashed_password)


def hash_password(password):
    return bcrypt_context.hash(password)


def create_access_token(login_id: str):
    payload = {'sub': login_id, 'category': 'access'}
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({'exp': expiration_time})
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.ENCODE_ALGORITHM)


def create_refresh_token(login_id: str):
    payload = {'sub': login_id, 'category': 'refresh'}
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRE_MINUTES)
    payload.update({'exp': expiration_time})
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.ENCODE_ALGORITHM)


def decode_refresh_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ENCODE_ALGORITHM])
        login_id: str = payload.get('sub')
        token_category: str = payload.get('category')
        expiration_time: int = payload.get('exp')

        if token_category != 'refresh':
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='올바르지 않은 유형의 토큰입니다.')

        return {'login_id': login_id, 'token_category': token_category, 'expiration_time': expiration_time}

    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='만료된 Refresh 토큰입니다.')

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='유효하지 않은 토큰입니다.')


