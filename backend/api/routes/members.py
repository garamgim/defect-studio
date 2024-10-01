import random
import string

from fastapi import APIRouter, Query
from fastapi_mail import MessageSchema, MessageType, FastMail, ConnectionConfig
from aioredis import Redis
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, Response, status, Depends
from starlette.responses import JSONResponse

from core.config import settings
from crud import members as members_crud, tokens as tokens_crud, token_logs as token_logs_crud
from models import *
from dependencies import get_db, get_current_user, get_redis
from schema.members import MemberCreate, MemberRead, MemberUpdate, EmailVerificationRequest, EmailVerificationCheck
from schema.token_logs import TokenLogCreate
from schema.tokens import TokenUsageRead, TokenUse
from typing import List, Optional
from api.routes.admin import role_required

from core.security import hash_password

router = APIRouter(
    prefix="/members",
    tags=["members"]
)

@router.get("/all", response_model=List[MemberRead])
@role_required([Role.super_admin])
async def get_all_members(session: Session = Depends(get_db), current_user: Member = Depends(get_current_user)):
    members = members_crud.get_all_members(session)
    members_read = [MemberRead.from_orm(member) for member in members]
    return members_read

@router.post("/signup")
async def signup(member: MemberCreate, session: Session = Depends(get_db)):
    existing_member = members_crud.get_member_by_login_id(session, member.login_id)
    if existing_member:
        raise HTTPException(status_code=409, detail="이미 동일한 아이디의 회원이 존재합니다.")

    members_crud.create_member(session, member)

    return Response(status_code=status.HTTP_200_OK, content="회원가입이 완료되었습니다.")

@router.get("/tokens", response_model=List[TokenUsageRead])
def get_tokens_usages(session: Session = Depends(get_db),
                      member: Member = Depends(get_current_user)):
    member_id = member.member_id
    token_usage_reads = tokens_crud.get_token_usages(session, member_id)
    return token_usage_reads

@router.post("/tokens")
def use_tokens(token_use: TokenUse,
               session: Session = Depends(get_db),
               member: Member = Depends(get_current_user)):
    if member.role != Role.super_admin:
        if member.token_quantity < token_use.cost:
            raise HTTPException(status_code=400, detail="보유 토큰이 부족합니다.")

        remaining_cost = token_use.cost
        batch_size = 100
        offset = 0

        while remaining_cost > 0:
            token_usages = tokens_crud.get_token_usages_with_batch_size(session, member.member_id, offset, batch_size)

            if not token_usages:
                break

            for token_usage in token_usages:
                if remaining_cost <= 0:
                    break

                if token_usage.quantity <= remaining_cost:
                    remaining_cost -= token_usage.quantity
                    session.delete(token_usage)
                else:
                    token_usage.quantity -= remaining_cost
                    remaining_cost = 0
            offset += batch_size

        member.token_quantity -= token_use.cost
        session.commit()

    # 이미 같은 타입 & 같은 날짜 token_log 있으면 quantity만 추가
    token_log = token_logs_crud.get_token_log_by_same_criteria(token_use.use_type, member.member_id, token_use.model,
                                                               session)
    if token_log:
        token_log.quantity += token_use.cost
        token_log.image_quantity += token_use.image_quantity
        session.commit()
    else:
        token_log_create = TokenLogCreate(
            log_type=LogType.use,
            use_type=token_use.use_type,
            member_id=member.member_id,
            quantity=token_use.cost,
            department_id=member.department_id,
            image_quantity=token_use.image_quantity,
            model=token_use.model,
        )
        token_logs_crud.create_token_log(session, token_log_create)

    return Response(status_code=200, content="토큰이 사용되었습니다.")

@router.post("/email")
async def send_verification_email(email_request: EmailVerificationRequest, redis: Redis = Depends(get_redis)):
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    )

    verification_code = generate_verification_code(8)
    html = f"""<p>Hi, {email_request.name}.</p>
                <p>We are sending you an authentication code to sign up for a defect studio membership.</p>
                <p>Please enter this authentication code within 3 minutes.</p>
                <h3>{verification_code}</h3> """

    message = MessageSchema(
        subject="Defect Studio Email Verification",
        recipients=[email_request.email],
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)

    await redis.setex(email_request.email, 180, verification_code) # redis에 인증 코드 3분 유효 기간으로 저장

    return JSONResponse(status_code=status.HTTP_200_OK, content="이메일이 정상적으로 전송되었습니다.")

def generate_verification_code(length: int):
    characters = string.ascii_letters + string.digits
    verification_code = ''.join(random.choice(characters) for _ in range(length))
    return verification_code

@router.post("/email/verification")
async def verify_email(email_check: EmailVerificationCheck, redis: Redis = Depends(get_redis)):
    verification_code = await redis.get(email_check.email)
    if not verification_code:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 이메일에 대한 인증 코드가 만료되었거나 아직 전송되지 않았습니다.")

    verification_code = verification_code.decode('utf-8')
    if verification_code == email_check.verification_code:
        return Response(status_code=status.HTTP_200_OK, content="이메일 인증이 확인되었습니다.")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="인증 코드가 일치하지 않습니다.")

@router.get("/guests")
@role_required([Role.super_admin])
async def get_guest_members(session: Session = Depends(get_db),
                         current_user: Member = Depends(get_current_user)):
    return members_crud.get_guests(session)

@router.get("/{member_id}", response_model=MemberRead)
def read_member_by_id(member_id: int, session: Session = Depends(get_db)):
    member = session.query(Member).options(joinedload(Member.department)).filter(
        Member.member_id == member_id).one_or_none()
    response = MemberRead.from_orm(member)
    return response

@router.delete("/{member_id}")
@role_required([Role.super_admin])
async def reject_guest_member(member_id: int,
                              session: Session = Depends(get_db),
                              current_user: Member = Depends(get_current_user)):
    member = members_crud.get_member_by_member_id(session, member_id)

    if not member:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    session.delete(member)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.patch("/{member_id}/role")
@role_required([Role.super_admin])
async def update_guest_member_role(member_id: int,
                                   new_role: Role,
                                   session: Session = Depends(get_db),
                                   current_user: Member = Depends(get_current_user)):
    member = members_crud.get_member_by_member_id(session, member_id)

    if not member:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    if new_role == Role.super_admin:
        raise HTTPException(status_code=400, detail="총관리자로는 권한 변경이 불가합니다.")

    members_crud.update_member_role(session, member, new_role)

    return Response(status_code=200, content=f"{new_role.value}로 해당 회원의 권한이 변경되었습니다.")

@router.get("", response_model=MemberRead)
def read_member_me(session: Session = Depends(get_db), member: Member = Depends(get_current_user)):
    member = session.query(Member).options(joinedload(Member.department)).filter(
        Member.member_id == member.member_id).one_or_none()

    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")

    response = MemberRead.from_orm(member)
    return response

@router.patch("", response_model=MemberRead)
def update_member_me(request: MemberUpdate, member: Member = Depends(get_current_user),
                     session: Session = Depends(get_db)):
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(member, key, value if key != "password" else hash_password(value))

    session.commit()
    session.refresh(member)
    response = MemberRead.from_orm(member)
    return response


@router.delete("")
def delete_member_me(member: Member = Depends(get_current_user), session: Session = Depends(get_db)):
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")

    session.delete(member)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/statistics/rank/{rank_criteria}")
@role_required([Role.super_admin])
async def get_statistics_rank(rank_criteria: str,
                        session: Session = Depends(get_db),
                        current_user: Member = Depends(get_current_user)):
    results = {}
    if rank_criteria == "image":
        statistics = token_logs_crud.get_statistics_images_with_rank(session)
        results = [{"rank": record[0], "member_id": record[1], "member_name": record[2], "quantity": record[3]} for record in statistics]
    elif rank_criteria == "tool":
        statistics = token_logs_crud.get_statistics_tools_with_rank(session)
        results = {}
        for record in statistics:
            use_type = record[0].value
            if use_type not in results:
                results[use_type] = []
            results[use_type].append({
                "rank": record[1],
                "member_id": record[2],
                "member_name": record[3],
                "quantity": record[4]
            })
    elif rank_criteria == "model":
        statistics = token_logs_crud.get_statistics_models_with_rank(session)
        for record in statistics:
            model = record[0]
            if model not in results:
                results[model] = []
            results[model].append({
                "rank": record[1],
                "member_id": record[2],
                "member_name": record[3],
                "quantity": record[4]
            })
    elif rank_criteria == "token":
        statistics = token_logs_crud.get_statistics_tokens_usage_with_rank(session)
        results = [{"rank": record[0], "member_id": record[1], "member_name": record[2], "quantity": record[3]} for record in statistics]
    else:
        raise HTTPException(status_code=400, detail="해당하는 ranking criteria가 없습니다.")
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/{member_id}/statistics/images")
def get_statistics_daily_images(member_id: int,
                                member: Member = Depends(get_current_user),
                                session: Session = Depends(get_db)):
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
    if member.member_id != member_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="사용자 pk가 일치하지 않습니다.")

    statistics = token_logs_crud.get_statistics_images_by_member_id(session, member.member_id)

    results = [{"create_date": record[0].isoformat(), "image_quantity": record[1]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/{member_id}/statistics/tools")
def get_statistics_tools(member_id: int,
                        member: Member = Depends(get_current_user),
                        session: Session = Depends(get_db)):
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
    if member.member_id != member_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="사용자 pk가 일치하지 않습니다.")

    statistics = token_logs_crud.get_statistics_tools_by_member_id(session, member.member_id)

    results = [{"use_type": record[0].value, "usage":record[1]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/{member_id}/statistics/models")
def get_statistics_models(member_id: int,
                        member: Member = Depends(get_current_user),
                        session: Session = Depends(get_db)):
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
    if member.member_id != member_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="사용자 pk가 일치하지 않습니다.")

    statistics = token_logs_crud.get_statistics_models_by_member_id(session, member.member_id)

    results = [{"model":record[0], "usage":record[1]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

@router.get("/{member_id}/statistics/tokens/usage")
def get_statistics_tokens_usage(member_id: int,
                        start_date: Optional[datetime] = Query(None),
                        end_date: Optional[datetime] = Query(None),
                        member: Member = Depends(get_current_user),
                        session: Session = Depends(get_db)):
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
    if member.member_id != member_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="사용자 pk가 일치하지 않습니다.")

    statistics = token_logs_crud.get_statistics_tokens_usage_by_member_id(session, member_id, start_date, end_date)
    results = [{"usage_date": record[0].isoformat(), "use_type": record[1].value, "token_quantity": record[2]} for record in statistics]
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)