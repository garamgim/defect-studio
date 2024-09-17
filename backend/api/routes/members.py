from fastapi import APIRouter
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, Response, status, Depends
from crud import members as members_crud, tokens as tokens_crud, token_logs as token_logs_crud
from models import *
from dependencies import get_db, get_current_user
from schema.members import MemberCreate, MemberRead, MemberUpdate
from schema.token_logs import TokenUsageLogSearch, TokenLogCreate
from schema.tokens import TokenUsageRead
from typing import List

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
def use_tokens(cost: int, use_type: UseType,
               session: Session = Depends(get_db),
               member: Member = Depends(get_current_user)):
    if member.token_quantity < cost:
        raise HTTPException(status_code=400, detail="보유 토큰이 부족합니다.")

    remaining_cost = cost
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

    member.token_quantity -= cost
    session.commit()

    token_log_create = TokenLogCreate(
        log_type=LogType.use,
        use_type=use_type,
        member_id=member.member_id,
        quantity=cost,
        department_id=member.department_id
    )
    tokens_crud.create_token_log(session, token_log_create)

    return Response(status_code=200, content="토큰이 사용되었습니다.")

@router.get("/token-logs/use")
def get_token_logs(token_usage_log: TokenUsageLogSearch,
                   session: Session = Depends(get_db),
                   member: Member = Depends(get_current_user)):

    return token_logs_crud.get_token_usage_logs(session, token_usage_log)

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


@router.delete("", response_model=MemberRead)
def delete_member_me(member: Member = Depends(get_current_user), session: Session = Depends(get_db)):
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")

    session.delete(member)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT, content="회원 정보가 삭제되었습니다.")
