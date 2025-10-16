import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db, create_tables
from routers import user
from models import Base, User, Post, Reaction, ReactionType
from schemas import PostCreate, PostResponse

app = FastAPI()

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# DB 세션 연결 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.include_router(user.router)

@app.on_event("startup")
def startup_event():
    create_tables()

# 게시글 작성
@app.post("/posts/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    # 현재 로그인한 유저 확인
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # 새 게시글 생성
    new_post = Post(
        title=post.title,
        content=post.content,
        category=post.category,
        user_id=user.id  # 로그인된 유저의 ID 자동 연결
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
