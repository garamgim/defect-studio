from datetime import datetime
from itertools import groupby
from typing import List
from fastapi import Depends
from dependencies import get_db
from models import Member, Token, TokenUsage, Department
from schema.tokens import TokenCreate, TokenUsageCreate, TokenRead, TokenReadByDepartment, TokenUsageRead
from sqlalchemy import Date, cast

def create_token(session: Depends(get_db), token: TokenCreate):
    db_token = Token(
        start_date=datetime.today(),
        end_date=token.end_date,
        origin_quantity=token.quantity,
        remain_quantity=token.quantity,
        is_active=True,  # 토큰 발급 시 활성화되어 발급됨
        department_id=token.department_id
    )

    session.add(db_token)
    session.commit()
    session.refresh(db_token)
    return db_token

def get_token_by_token_id(session: Depends(get_db), token_id: int):
    return session.query(Token).filter(Token.token_id == token_id).first()


def get_tokens(session: Depends(get_db)):
    tokens = session.query(Token).all()
    return convert_to_token_read_by_department(session, tokens)


def get_tokens_by_department_id(session: Depends(get_db), department_id: int):
    tokens = session.query(Token).filter(Token.department_id == department_id).all()
    return convert_to_token_read_by_department(session, tokens)


def convert_to_token_read_by_department(session: Depends(get_db), tokens: List[Token]):
    # 부서별로 토큰을 그룹화
    tokens_by_department = []
    tokens.sort(key=lambda x: x.department_id)
    for department_id, group in groupby(tokens, key=lambda x: x.department_id):
        department_name = session.query(Department.name).filter(Department.department_id == department_id).scalar()

        tokens_by_department.append(TokenReadByDepartment(
            department_id=department_id,
            department_name=department_name,
            tokens=[TokenRead.from_orm(token) for token in group]
        ))
    return tokens_by_department


def get_expired_active_tokens_with_usages_and_members(
        session: Depends(get_db),
        current_date: datetime,
        offset: int,
        limit: int):
    return (session.query(Token, TokenUsage, Member)
            .join(TokenUsage, Token.token_id == TokenUsage.token_id)
            .join(Member, TokenUsage.member_id == Member.member_id)
            .filter(cast(Token.end_date, Date) < cast(current_date, Date), Token.is_active == True)
            .offset(offset)
            .limit(limit)
            .all())


def create_token_usage(session: Depends(get_db), token_usage: TokenUsageCreate):
    db_token_usage = TokenUsage(
        quantity=token_usage.quantity,
        start_date=token_usage.start_date,
        end_date=token_usage.end_date,
        member_id=token_usage.member_id,
        token_id=token_usage.token_id
    )

    session.add(db_token_usage)
    session.commit()
    session.refresh(db_token_usage)
    return db_token_usage


def get_token_usages(session: Depends(get_db), member_id: int):
    token_usages = session.query(TokenUsage).filter(TokenUsage.member_id == member_id).order_by(
        TokenUsage.end_date.asc()).all()
    token_usage_reads = [TokenUsageRead.from_orm(token_usage) for token_usage in token_usages]
    return token_usage_reads


def get_token_usages_with_batch_size(session: Depends(get_db), member_id: int, offset: int, batch_size: int):
    token_usages = (session.query(TokenUsage)
                    .filter(TokenUsage.member_id == member_id)
                    .order_by(TokenUsage.end_date.asc())
                    .offset(offset)
                    .limit(batch_size)
                    .all())
    return token_usages