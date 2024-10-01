from datetime import datetime

from fastapi import Depends
from dependencies import get_db
from enums import LogType, UseType
from models import TokenLog, Member, Department
from schema.token_logs import TokenUsageLogRead, TokenLogRead, TokenLogCreate
from sqlalchemy import select, func, case, extract, cast, Date

def create_token_log(session: Depends(get_db), token_log: TokenLogCreate):
    db_token_log = TokenLog(
        create_date=datetime.today(),
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

def get_token_log_by_same_criteria(use_type: UseType, member_id: int, model: str, session: Depends(get_db)):
    today = datetime.today().date()
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())

    return session.query(TokenLog).\
        filter(TokenLog.member_id == member_id,
               TokenLog.create_date >= start_of_day,
               TokenLog.create_date <= end_of_day,
               TokenLog.log_type == LogType.use,
               TokenLog.use_type == use_type,
               TokenLog.model == model).\
        first()

def get_statistics_images_by_member_id(session: Depends(get_db), member_id: int):
    return session.query(cast(TokenLog.create_date, Date).label("use_date"), func.sum(TokenLog.image_quantity)).\
             filter(TokenLog.member_id == member_id, TokenLog.log_type == LogType.use).\
             group_by("use_date").\
             order_by("use_date").\
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
    query = session.query(cast(TokenLog.create_date, Date), TokenLog.use_type, TokenLog.quantity).filter(
        TokenLog.log_type == LogType.use,
        TokenLog.member_id == member_id)

    if start_date:
        query = query.filter(cast(TokenLog.create_date, Date) >= start_date)

    if end_date:
        query = query.filter(cast(TokenLog.create_date, Date) <= end_date)

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
    query = session.query(cast(TokenLog.create_date, Date), TokenLog.quantity).\
            filter(TokenLog.department_id == department_id, TokenLog.log_type == LogType.distribute)

    if start_date:
        query = query.filter(cast(TokenLog.create_date, Date) >= start_date)

    if end_date:
        query = query.filter(cast(TokenLog.create_date, Date) <= end_date)

    return query.all()

def get_statistics_tokens_usage_by_department_id(session: Depends(get_db), department_id: int):
    return session.query(TokenLog.member_id, Member.name, func.sum(TokenLog.quantity)). \
        join(Member, TokenLog.member_id == Member.member_id). \
        filter(TokenLog.department_id == department_id, TokenLog.log_type == LogType.use). \
        group_by(TokenLog.member_id, Member.name). \
        order_by(TokenLog.member_id.asc()). \
        all()

def get_statistics_images_by_departments(session: Depends(get_db)):
    return session.query(TokenLog.department_id, Department.name, func.sum(TokenLog.image_quantity)).\
             join(Department, TokenLog.department_id == Department.department_id).\
             filter(TokenLog.log_type == LogType.use).\
             group_by(TokenLog.department_id, Department.name).\
             order_by(TokenLog.department_id.asc()).\
             all()

def get_statistics_tools(session: Depends(get_db)):
    return session.query(TokenLog.department_id, Department.name, TokenLog.use_type, func.count(TokenLog.use_type)).\
        join(Department, TokenLog.department_id == Department.department_id).\
        filter(TokenLog.log_type == LogType.use).\
        group_by(TokenLog.department_id, Department.name, TokenLog.use_type).\
        order_by(TokenLog.department_id.asc(), TokenLog.use_type.asc()).\
        all()

def get_statistics_tokens_issue(session: Depends(get_db), start_date: datetime, end_date: datetime):
    query = session.query(cast(TokenLog.create_date, Date), TokenLog.quantity).\
            filter(TokenLog.log_type == LogType.issue)

    if start_date:
        query = query.filter(cast(TokenLog.create_date, Date) >= start_date)

    if end_date:
        query = query.filter(cast(TokenLog.create_date, Date) <= end_date)

    return query.all()

def get_statistics_tokens_usage(session: Depends(get_db), filter_type: str):
    if filter_type == "date":
        return session.query(cast(TokenLog.create_date, Date).label("use_date"), func.sum(TokenLog.quantity)). \
            filter(TokenLog.log_type == LogType.use).\
            group_by("use_date").\
            order_by("use_date").\
            all()


    elif filter_type == "hour":
        return session.query(extract('hour', TokenLog.create_date), func.sum(TokenLog.quantity)). \
            filter(TokenLog.log_type == LogType.use). \
            group_by(extract('hour', TokenLog.create_date)). \
            order_by(extract('hour', TokenLog.create_date).asc()). \
            all()

def get_statistics_images_with_rank(session: Depends(get_db)):
    subquery = session.query(TokenLog.member_id, Member.name, func.sum(TokenLog.image_quantity).label("quantity")).\
        join(Member, TokenLog.member_id == Member.member_id).\
        filter(TokenLog.log_type == LogType.use).\
        group_by(TokenLog.member_id,Member.name).\
        subquery()

    ranked_query = session.query(
        func.rank().over(order_by=subquery.c.quantity.desc()).label("rank"),
        subquery.c.member_id,
        subquery.c.name,
        subquery.c.quantity
    ).order_by(subquery.c.quantity.desc()).limit(10).all()
    return ranked_query

def get_statistics_tools_with_rank(session: Depends(get_db)):
    subquery = session.query(TokenLog.use_type, TokenLog.member_id, Member.name,
                             func.count(TokenLog.use_type).label("quantity"),
                             func.rank().over(partition_by=TokenLog.use_type, order_by=func.count(TokenLog.use_type).desc()).label("rank")).\
        join(Member, TokenLog.member_id == Member.member_id).\
        filter(TokenLog.log_type == LogType.use).\
        group_by(TokenLog.use_type, TokenLog.member_id,Member.name).\
        subquery()

    ranked_query = session.query(
        subquery.c.use_type,
        subquery.c.rank,
        subquery.c.member_id,
        subquery.c.name,
        subquery.c.quantity
    ).filter(subquery.c.rank <= 10).order_by(subquery.c.use_type.asc(), subquery.c.rank).all()
    return ranked_query

def get_statistics_models_with_rank(session: Depends(get_db)):
    subquery = session.query(TokenLog.model, TokenLog.member_id, Member.name,
                             func.count(TokenLog.model).label("quantity"),
                             func.rank().over(partition_by=TokenLog.model, order_by=func.count(TokenLog.use_type).desc()).label("rank")). \
        join(Member, TokenLog.member_id == Member.member_id). \
        filter(TokenLog.log_type == LogType.use). \
        group_by(TokenLog.model, TokenLog.member_id, Member.name). \
        subquery()

    ranked_query = session.query(
        subquery.c.model,
        subquery.c.rank,
        subquery.c.member_id,
        subquery.c.name,
        subquery.c.quantity
    ).filter(subquery.c.rank <= 10).order_by(subquery.c.model.asc(), subquery.c.rank).all()
    return ranked_query

def get_statistics_tokens_usage_with_rank(session: Depends(get_db)):
    subquery = session.query(TokenLog.member_id, Member.name, func.sum(TokenLog.quantity).label("quantity")). \
        join(Member, TokenLog.member_id == Member.member_id). \
        filter(TokenLog.log_type == LogType.use). \
        group_by(TokenLog.member_id, Member.name). \
        subquery()

    ranked_query = session.query(
        func.rank().over(order_by=subquery.c.quantity.desc()).label("rank"),
        subquery.c.member_id,
        subquery.c.name,
        subquery.c.quantity
    ).order_by(subquery.c.quantity.desc()).limit(10).all()
    return ranked_query