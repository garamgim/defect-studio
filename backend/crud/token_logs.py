from fastapi import Depends
from dependencies import get_db
from enums import LogType, UseType
from models import TokenLog
from schema.token_logs import TokenUsageLogSearch, TokenUsageLogRead, TokenLogSearch, TokenLogRead


def get_token_usage_logs(session: Depends(get_db), token_usage_logs_search: TokenUsageLogSearch):
    query = session.query(TokenLog).filter(
                TokenLog.log_type == LogType.use,
                TokenLog.member_id == token_usage_logs_search.member_id,
                TokenLog.use_type == token_usage_logs_search.use_type)

    if token_usage_logs_search.start_date:
        query = query.filter(TokenLog.create_date >= token_usage_logs_search.start_date)

    if token_usage_logs_search.end_date:
        query = query.filter(TokenLog.create_date <= token_usage_logs_search.end_date)

    token_logs = query.all()

    return [TokenUsageLogRead.from_orm(token_log) for token_log in token_logs]

def get_token_logs(session: Depends(get_db), log_type: LogType, token_logs_search: TokenLogSearch):
    query = session.query(TokenLog).filter(
        TokenLog.department_id == token_logs_search.department_id,
        TokenLog.log_type == log_type)

    if token_logs_search.start_date:
        query = query.filter(TokenLog.create_date >= token_logs_search.start_date)

    if token_logs_search.end_date:
        query = query.filter(TokenLog.create_date <= token_logs_search.end_date)

    token_logs = query.all()

    return [TokenLogRead.from_orm(token_log) for token_log in token_logs]