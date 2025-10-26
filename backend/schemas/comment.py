from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    author: str

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: str

class Comments(CommentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True