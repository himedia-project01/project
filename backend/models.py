from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Enum
from sqlalchemy.sql import func
from database import Base

# 사용자 테이블 생성 모델
class User(Base):
    __tablename__ = 'users'

    # 사용자 고유 ID
    id = Column(Integer, primary_key=True, autoincrement=True)
    # 이름
    name = Column(String(50), nullable=False, unique=True)
    # 이메일
    email = Column(String(150), nullable=False)
    # 비밀번호
    password = Column(String(150), nullable=False)
    # 닉네임
    nickname = Column(String(50), nullable=False, unique=True)
    # 생년월일
    birth = Column(DateTime)
    # 성별
    gender = Column(String(10),  Enum('male', 'female', 'none', name='gender_enum'), nullable=False)
    # 가입일자
    created_at = Column(DateTime, server_default=func.now())
    # 탈퇴여부
    is_deleted = Column(Boolean, default=False)