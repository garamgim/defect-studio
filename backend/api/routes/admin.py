

from fastapi import APIRouter, HTTPException, Response, status
from fastapi.params import Depends
from sqlalchemy.orm import Session

from models import Member
from schema.tokens import TokenCreate, TokenCreates, TokenUsageCreate, TokenReadByDepartment, TokenDistribute
from schema.token_logs import TokenLogCreate
from enums import Role, LogType
from crud import members as members_crud, tokens as tokens_crud, token_logs as token_logs_crud
from dependencies import get_db, get_current_user

from typing import List, Optional
from functools import wraps

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
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

# 토큰 발급
@router.post("/tokens")
@role_required([Role.super_admin]) # only super_admin can issue token
async def issue_token(token_creates: TokenCreates,
                      session: Session = Depends(get_db),
                      current_user: Member = Depends(get_current_user)
                      ):

    for department_id in token_creates.department_ids:
        token = TokenCreate(
            end_date=token_creates.end_date,
            quantity=token_creates.quantity,
            department_id=department_id  # 각 부서에 대해 발급
        )
        tokens_crud.create_token(session, token)

        token_log_create = TokenLogCreate(
            log_type=LogType.issue,
            member_id=current_user.member_id,
            quantity=token_creates.quantity,
            department_id=department_id
        )
        token_logs_crud.create_token_log(session, token_log_create)

    return Response(status_code=201, content="토큰이 발급되었습니다.")


# 관리자 토큰 조회
@router.get("/tokens", response_model=List[TokenReadByDepartment])
@role_required([Role.super_admin, Role.department_admin])
async def get_tokens(department_id: Optional[int] = None,
                     session: Session = Depends(get_db),
                      current_user: Member = Depends(get_current_user)):
    # 부서별 관리자는 자기 부서의 토큰만 조회
    if current_user.role == Role.department_admin:
        return tokens_crud.get_tokens_by_department_id(session, current_user.department_id)

    # 총관리자는 특정 부서의 토큰 조회 가능, 부서 ID가 없으면 전체 조회
    if current_user.role == Role.super_admin:
        if department_id:
            tokens = tokens_crud.get_tokens_by_department_id(session, department_id)
            if not tokens:
                raise HTTPException(status_code=400, detail="해당 부서는 없는 부서입니다")
            return tokens
        else:
            return tokens_crud.get_tokens(session)


# 토큰 분배
@router.post("/tokens/{token_id}")
@role_required([Role.super_admin, Role.department_admin]) # admin can distribute token
async def distribute_token(
        token_id : int, token_distribute: TokenDistribute,
       session: Session = Depends(get_db),
       current_user : Member = Depends(get_current_user)):
    token = tokens_crud.get_token_by_token_id(session, token_id)

    if not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="없는 token_id입니다.")

    # member_ids가 없으면 부서의 모든 회원 조회, 있으면 해당 회원들 조회
    if token_distribute.member_ids:
        members = members_crud.get_members_by_member_ids(session, token_distribute.member_ids)
    else:
        members = members_crud.get_members_by_department_id(session, token.department_id)
    member_count = len(members)

    if not members:
        raise HTTPException(status_code=404, detail="선택된 회원을 찾을 수 없습니다.")

    if token_distribute.quantity <= 0:
        raise HTTPException(status_code=422, detail="토큰 수는 0보다 커야 합니다.")

    if token.remain_quantity < token_distribute.quantity:
        raise HTTPException(status_code=422, detail="남아 있는 토큰 수보다 더 많은 양의 토큰을 지정할 수 없습니다.")

    if token.remain_quantity/member_count < token_distribute.quantity: # 토큰 수 / 회원 수 보다 작아야 함
        raise HTTPException(status_code=422, detail="모든 회원에게 분배할 수 없는 토큰 수입니다.")

    token.remain_quantity -= token_distribute.quantity * member_count
    session.add(token)

    for member in members:
        token_usage_create = TokenUsageCreate(
            quantity=token_distribute.quantity,
            start_date=token.start_date,
            end_date=token.end_date,
            member_id=member.member_id,
            token_id=token.token_id
        )
        tokens_crud.create_token_usage(session, token_usage_create) # token_usage 생성
        member.token_quantity += token_distribute.quantity # member의 token_quantity 갱신
        session.add(member)
    session.commit()

    token_log_create = TokenLogCreate(
        log_type=LogType.distribute,
        member_id=current_user.member_id,
        quantity=token_distribute.quantity*member_count,
        department_id=token.department_id
    )
    token_logs_crud.create_token_log(session, token_log_create)

    return Response(status_code=201, content="토큰이 해당 부서의 회원들에게 분배되었습니다.")