from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str
    password: str
    nickname: str
    birth: Optional[datetime] = None
    gender: str

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    id: int
    password: Optional[str] = None
    nickname: Optional[str] = None
    gender: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime

