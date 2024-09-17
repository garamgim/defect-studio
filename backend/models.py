from datetime import datetime

from beanie import Document
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Boolean, Index

from enums import Role, LogType, UseType
from core.db import Base
from typing import Optional

class Department(Base):
    __tablename__ = 'department'

    department_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    members = relationship("Member", back_populates="department")
    tokens = relationship("Token", back_populates="department")
    token_logs = relationship("TokenLog", back_populates="department")

class Member(Base):
    __tablename__ = 'member'

    member_id = Column(Integer, primary_key=True)
    login_id = Column(String(50), nullable=False, unique=True)
    password = Column(String, nullable=False)
    name = Column(String(100), nullable=False)
    nickname = Column(String(100), nullable=False, unique=True)
    email = Column(String(255), nullable=False)
    role = Column(Enum(Role), nullable=False)
    token_quantity = Column(Integer, nullable=False, default=0)
    create_date = Column(DateTime, nullable=False, default=datetime.today())
    department_id = Column(Integer, ForeignKey('department.department_id'))
    department = relationship("Department", back_populates="members")
    token_usages = relationship("TokenUsage", back_populates="member")
    token_logs = relationship("TokenLog", back_populates="member")

class Token(Base):
    __tablename__ = 'token'
    __table_args__ = (Index('ix_end_date_is_active', 'end_date', 'is_active'),)

    token_id = Column(Integer, primary_key=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    origin_quantity = Column(Integer, nullable=False)
    remain_quantity = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    department_id = Column(Integer, ForeignKey('department.department_id'))
    department = relationship("Department", back_populates="tokens")
    token_usages = relationship("TokenUsage", back_populates="token")

class TokenUsage(Base):
    __tablename__ = 'token_usage'
    __table_args__ = (Index('ix_member_id_end_date', 'member_id', 'end_date'),)

    usage_id = Column(Integer, primary_key=True)
    quantity = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    member_id = Column(Integer, ForeignKey('member.member_id'))
    member = relationship("Member", back_populates="token_usages")
    token_id = Column(Integer, ForeignKey('token.token_id'))
    token = relationship("Token", back_populates="token_usages")

class TokenLog(Base):
    __tablename__ = 'token_log'

    log_id = Column(Integer, primary_key=True)
    create_date = Column(DateTime, nullable=False)
    log_type = Column(Enum(LogType), nullable=False)
    use_type = Column(Enum(UseType), nullable=True)
    quantity = Column(Integer, nullable=True)
    member_id = Column(Integer, ForeignKey('member.member_id'))
    member = relationship("Member", back_populates="token_logs")
    department_id = Column(Integer, ForeignKey('department.department_id'))
    department = relationship("Department", back_populates="token_logs")


# Mongo DB Schemas

class GenerationPreset(Document):
    generation_type: Optional[str] = None
    model: Optional[str] = None
    prompt: Optional[str] = None
    negative_prompt: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    batch_count: Optional[int] = None
    batch_size: Optional[int] = None
    strength: Optional[int] = None
    guidance_scale: Optional[float] = None
    sampling_steps: Optional[int] = None
    sampling_method: Optional[str] = None
    seed: Optional[int] = None
    member_id: int = 0  # TODO : 로그인한 유저의 id로 변경
    date: datetime = datetime.today()
