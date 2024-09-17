from datetime import datetime
from pydantic import BaseModel, Field
from models import Token, TokenUsage
from typing import Optional, List

class TokenCreates(BaseModel):
    end_date: datetime = Field(...)
    quantity: int = Field(..., gt=0)
    department_ids: List[int] = Field(...)

class TokenCreate(BaseModel):
    end_date: datetime = Field(...)
    quantity: int = Field(..., gt=0)
    department_id: int = Field(...)

class TokenUsageCreate(BaseModel):
    quantity: int
    start_date: datetime
    end_date: datetime
    member_id: int
    token_id: int

class TokenRead(BaseModel):
    token_id: int
    start_date: datetime
    end_date: datetime
    origin_quantity: int
    remain_quantity: int
    is_active: bool
    department_id: int

    @classmethod
    def from_orm(cls, token: 'Token') -> 'TokenRead':
        return cls(
            token_id=token.token_id,
            start_date=token.start_date,
            end_date=token.end_date,
            origin_quantity=token.origin_quantity,
            remain_quantity=token.remain_quantity,
            is_active=token.is_active,
            department_id=token.department_id
        )

class TokenReadByDepartment(BaseModel):
    department_id: int
    department_name: str
    tokens: List[TokenRead]

class TokenDistribute(BaseModel):
    quantity: int = Field(...)
    member_ids: Optional[List[int]] = Field(None)

class TokenUsageRead(BaseModel):
    usage_id: int
    quantity: int
    start_date: datetime
    end_date: datetime

    @classmethod
    def from_orm(cls, token_usage: 'TokenUsage') -> 'TokenUsageRead':
        return cls(
            usage_id=token_usage.usage_id,
            quantity=token_usage.quantity,
            start_date=token_usage.start_date,
            end_date=token_usage.end_date
        )