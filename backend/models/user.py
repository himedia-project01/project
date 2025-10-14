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
    posts = relationship("Post", back_populates="user")
