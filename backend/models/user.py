from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password = Column(String(150), nullable=False)
    nickname = Column(String(50), nullable=False, unique=True)
    birth = Column(DateTime)
    gender = Column(Enum('male', 'female', 'none', name='gender_enum'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_deleted = Column(Boolean, default=False)

    comments = relationship("Comment", back_populates="user")
    posts = relationship("Post", back_populates="users")

# 사용자 테이블 생성 모델
# class User(Base):
#     __tablename__ = 'users'

#     # 사용자 고유 ID
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     # 이름
#     name = Column(String(50), nullable=False, unique=True)
#     # 이메일
#     email = Column(String(150), nullable=False)
#     # 비밀번호
#     password = Column(String(150), nullable=False)
#     # 닉네임
#     nickname = Column(String(50), nullable=False, unique=True)
#     # 생년월일
#     birth = Column(DateTime)
#     # 성별
#     gender = Column(String(10),  Enum('male', 'female', 'none', name='gender_enum'), nullable=False)
#     # 가입일자
#     created_at = Column(DateTime, server_default=func.now())
#     # 탈퇴여부
#     is_deleted = Column(Boolean, default=False)
