from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

# 사용자 테이블 생성 모델
class User(Base):
    __tablename__ = 'users'

    # 사용자 고유 ID
    id = Column(Integer, primary_key=True, autoincrement=True)
    # 이름
    name = Column(String(50), nullable=False)
    # 이메일
    email = Column(String(150), nullable=False, unique=True)
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

    reactions = relationship("Reaction", back_populates="user")
    posts = relationship("Post", back_populates="user")

    # 댓글과 연결할 경우 예시 : 아래의 comments가 관계변수입니다. 
    # comment 클래스에서 back_populates="comments" 작성 시 User와 FK 연결됩니다
    
    # 관계변수 선언
    # comments = relationship("Comment", back_populates="Comment 클래스에 작성된 관계변수이름") 