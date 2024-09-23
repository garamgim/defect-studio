from pydantic import BaseModel, EmailStr, Field
import re
from models import Member
from enums import Role
from typing import Optional

class MemberCreate(BaseModel):
    login_id: str = Field(..., min_length=3, max_length=50)
    password: str = Field(pattern=re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$"))
    name: str = Field(..., min_length=3, max_length=100)
    nickname: str = Field(..., min_length=3, max_length=50, )
    email: EmailStr
    department_id: int = Field(...)


class MemberRead(BaseModel):
    member_id: int
    login_id: str
    nickname: str
    email: EmailStr
    role: Role
    department_id: int
    department_name: str
    token_quantity: int

    @classmethod
    def from_orm(cls, member: 'Member') -> 'MemberRead':
        return cls(
            member_id=member.member_id,
            login_id=member.login_id,
            nickname=member.nickname,
            email=member.email,
            role=member.role,
            department_id=member.department_id,
            department_name=member.department.name if member.department else "null",
            token_quantity=member.token_quantity
        )

class MemberReadByDepartment(BaseModel):
    member_id: int
    name: str
    nickname: str
    token_quantity: int

    @classmethod
    def from_orm(cls, member: 'Member') -> 'MemberReadByDepartment':
        return cls(
            member_id = member.member_id,
            name = member.name,
            nickname = member.nickname,
            token_quantity = member.token_quantity
        )


class MemberUpdate(BaseModel):
    password: Optional[str] = Field(None, pattern=re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$"))
    nickname: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None