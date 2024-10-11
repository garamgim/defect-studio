from core.db import Session
from datetime import datetime, timedelta

from crud import tokens as tokens_crud, members as members_crud

def expire_tokens(batch_size=100):
    with Session() as session:
        current_date = datetime.now()
        offset = 0

        while True:
            expired_tokens = tokens_crud.get_expired_active_tokens_with_usages_and_members(session, current_date, offset=offset, limit=batch_size)
            if not expired_tokens:
                break

            for token, usage, member in expired_tokens:
                token.is_active = False
                if member:
                    member.token_quantity -= usage.quantity
                session.delete(usage)
            session.commit()

            offset += batch_size

def delete_guests(batch_size=100):
    with Session() as session:
        three_days_ago = datetime.now() - timedelta(days=3)
        offset = 0

        while True:
            guests = members_crud.get_expired_guests(session, three_days_ago, offset=offset, limit=batch_size)
            if not guests:
                break

            for guest in guests:
                session.delete(guest)

            session.commit()

            offset += batch_size