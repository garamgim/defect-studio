from datetime import datetime

from fastapi import Depends
from dependencies import get_db
from enums import LogType, UseType
from models import TokenLog, Member
from schema.token_logs import TokenUsageLogRead, TokenLogRead, TokenLogCreate
from sqlalchemy import select, func, case

def create_token_log(session: Depends(get_db), token_log: TokenLogCreate):
    db_token_log = TokenLog(
        create_date=datetime.today().date(),
        log_type=token_log.log_type,
        use_type=token_log.use_type,
        member_id=token_log.member_id,
        quantity=token_log.quantity,
        department_id=token_log.department_id,
        image_quantity=token_log.image_quantity,
        model=token_log.model
    )
    session.add(db_token_log)
    session.commit()
    session.refresh(db_token_log)
    return db_token_log

def get_statistics_images_by_member_id(session: Depends(get_db), member_id: int):
    return session.query(TokenLog.create_date, func.sum(TokenLog.image_quantity)).\
             filter(TokenLog.member_id == member_id, TokenLog.log_type == LogType.use).\
             group_by(TokenLog.create_date).\
             order_by(TokenLog.create_date.asc()).\
             all()

def get_statistics_tools_by_member_id(session: Depends(get_db), member_id: int):
    return session.query(TokenLog.use_type, func.count(TokenLog.use_type)).\
        filter(TokenLog.member_id == member_id, TokenLog.log_type == LogType.use).\
        group_by(TokenLog.use_type).\
        order_by(TokenLog.use_type.asc()).\
        all()

def get_statistics_models_by_member_id(session: Depends(get_db), member_id: int):
    return session.query(TokenLog.model, func.count(TokenLog.model)).\
        filter(TokenLog.member_id == member_id, TokenLog.log_type == LogType.use).\
        group_by(TokenLog.model).\
        order_by(TokenLog.model.asc()).\
        all()

def get_statistics_tokens_usage_by_member_id(session: Depends(get_db), member_id: int, start_date: datetime, end_date: datetime):
    query = session.query(TokenLog.create_date, TokenLog.use_type, TokenLog.quantity).filter(
        TokenLog.log_type == LogType.use,
        TokenLog.member_id == member_id)

    if start_date:
        query = query.filter(TokenLog.create_date >= start_date)

    if end_date:
        query = query.filter(TokenLog.create_date <= end_date)

    return query.all()

def get_statistics_images_by_department_id(session: Depends(get_db), department_id: int):
    return session.query(TokenLog.member_id, Member.name, func.sum(TokenLog.image_quantity)).\
            join(Member, TokenLog.member_id == Member.member_id).\
            filter(TokenLog.department_id == department_id, TokenLog.log_type == LogType.use).\
            group_by(TokenLog.member_id, Member.name).\
            order_by(TokenLog.member_id.asc()).\
            all()

def get_statistics_tools_by_department_id(session: Depends(get_db), department_id: int):
    return session.query(TokenLog.use_type, func.count(TokenLog.use_type)). \
        filter(TokenLog.department_id == department_id, TokenLog.log_type == LogType.use). \
        group_by(TokenLog.use_type). \
        order_by(TokenLog.use_type.asc()). \
        all()

def get_statistics_tokens_distributions_by_department_id(session: Depends(get_db), department_id: int, start_date: datetime, end_date: datetime):
    query = session.query(TokenLog.create_date, TokenLog.quantity).\
            filter(TokenLog.department_id == department_id, TokenLog.log_type == LogType.distribute)

    if start_date:
        query = query.filter(TokenLog.create_date >= start_date)

    if end_date:
        query = query.filter(TokenLog.create_date <= end_date)

    return query.all()

def get_statistics_tokens_usage_by_department_id(session: Depends(get_db), department_id: int):
    return session.query(TokenLog.member_id, Member.name, func.sum(TokenLog.quantity)). \
        join(Member, TokenLog.member_id == Member.member_id). \
        filter(TokenLog.department_id == department_id, TokenLog.log_type == LogType.use). \
        group_by(TokenLog.member_id, Member.name). \
        order_by(TokenLog.member_id.asc()). \
        all()