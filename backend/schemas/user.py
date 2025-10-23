from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

# 기본 스키마
class UserBase(BaseModel):
    name: str
    email: str
    password: str
    nickname: str
    birth: Optional[date] = None
    gender: str

# 로그인 스키마
class UserRead(BaseModel):
    email: str
    password: str

# 생성 스키마
class UserCreate(UserBase):
    pass

# 수정 스키마
class UserUpdate(BaseModel):
    id: int
    password: Optional[str] = None
    nickname: Optional[str] = None
    gender: Optional[str] = None

# 응답 스키마
class UserResponse(UserBase):
    id: int
    created_at: datetime
