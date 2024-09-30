from typing_extensions import Self

from pydantic import BaseModel, Field
from datetime import datetime
from models import TokenLog
from enums import LogType, UseType
from typing import Optional, Any

class TokenLogCreate(BaseModel):
    log_type: LogType
    use_type: Optional[UseType] = None
    image_quantity: Optional[int] = None
    model: Optional[str] = None
    member_id: int
    quantity: int
    department_id: int

class TokenLogRead(BaseModel):
    create_date: datetime
    log_type: LogType
    quantity: int

    @classmethod
    def from_orm(cls, token_log: 'TokenLog') -> 'TokenLogRead':
        return cls(
            create_date=token_log.create_date,
            log_type=token_log.log_type,
            quantity=token_log.quantity
        )

class TokenUsageLogRead(TokenLogRead):
    use_type: UseType
    image_quantity: int
    model: str

    @classmethod
    def from_orm(cls, token_log: 'TokenLog') -> 'TokenUsageLogRead':
        return cls(
            create_date=token_log.create_date,
            log_type=token_log.log_type,
            quantity=token_log.quantity,
            use_type=token_log.use_type,
            image_quantity=token_log.image_quantity,
            model=token_log.model
        )