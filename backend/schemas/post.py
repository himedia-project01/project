from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


# -------------------- Post --------------------
class PostBase(BaseModel):
    title: str
    content: str
    category: Optional[List[str]] = None

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    views: int
    created_date: datetime
    updated_date: Optional[datetime] = None
    likes: Optional[int] = 0
    dislikes: Optional[int] = 0

    class Config:
        orm_mode = True


# -------------------- Reaction --------------------
class ReactionBase(BaseModel):
    reaction_type: ReactionType

class ReactionResponse(ReactionBase):
    id: int
    user_id: int
    post_id: int

    class Config:
        orm_mode = True


# -------------------- Reaction Enum --------------------
class ReactionType(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"