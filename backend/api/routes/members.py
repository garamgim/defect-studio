from fastapi import APIRouter, Query
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, Response, status, Depends
from starlette.responses import JSONResponse

from crud import members as members_crud, tokens as tokens_crud, token_logs as token_logs_crud
from models import *
from dependencies import get_db, get_current_user
from schema.members import MemberCreate, MemberRead, MemberUpdate
from schema.token_logs import TokenLogCreate
from schema.tokens import TokenUsageRead, TokenUse
from typing import List, Optional
from enums import UseType

router = APIRouter(
    prefix="/members",
    tags=["members"]
)


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

@router.get("/{member_id}", response_model=MemberRead)
def read_member_by_id(member_id: int, session: Session = Depends(get_db)):
    member = session.query(Member).options(joinedload(Member.department)).filter(
        Member.member_id == member_id).one_or_none()
    response = MemberRead.from_orm(member)
    return response

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
        setattr(member, key, value)

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

@router.get("/{members_id}/statistics/tools")
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