from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from enum import Enum as PyEnum

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


# 게시글 테이블 생성 모델
class Post(Base):
    __tablename__ = 'posts'

    # 게시글 고유 ID
    id = Column(Integer, primary_key=True, autoincrement=True)
    # user_id = 
    # 제목
    title = Column(String(80), nullable=False)
    # 내용
    content = Column(Text, nullable=False)
    # 카테고리
    category = Column(ARRAY(String))
    # 작성
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    # 수정
    updated_date = Column(DateTime(timezone=True), onupdate=func.now())
    # 삭제
    is_deleted = Column(Boolean, default=False)
    # 조회수
    views = Column(Integer, default=0)
    # 좋아요/싫어요
    reactions = relationship("Reaction", back_populates="post", cascade="all, delete-orphan")


# Reaction 관련 테이블 생성 모델
# 1) Enum으로 like(좋아요) / dislike(싫어요) 구분
class ReactionType(PyEnum):
    LIKE = "like"
    DISLIKE = "dislike"

# 2) Reaction 테이블
class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    reaction_type = Column(Enum(ReactionType), nullable=False)

    # 하나의 user가 하나의 post에 대해 한 번만 반응 가능하도록 제약
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='unique_user_post_reaction'),
    )

    # 관계 연결
    user = relationship("User", back_populates="reactions")
    post = relationship("Post", back_populates="reactions")