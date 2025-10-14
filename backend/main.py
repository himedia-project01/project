import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database import create_tables, get_db
from models.comment import Comment
from models.post import Post
from models.user import User
from pydantic import BaseModel

app = FastAPI()

class CommentCreate(BaseModel):
    content: str
    post_id: int
    user_id: int

@app.on_event("startup")
def startup_event():
    create_tables()

@app.post('/comments')
def create_comment(comment_data: CommentCreate, db: Session = Depends(get_db)):

    new_comment = Comment(
        content = comment_data.content,
        post_id = comment_data.post_id,
        user_id = comment_data.user_id
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return {
        "comment_id": new_comment.comment_id,
        "content": new_comment.content,
        "post_id": new_comment.post_id,
        "user_id": new_comment.user_id,
        "created_at": new_comment.created_at
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
