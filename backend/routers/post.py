import uvicorn
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
from models.user import User
from models.post import Post, Reaction, ReactionType
from schemas.post import PostCreate, PostResponse

routers = APIRouter(prefix = '/posts')

# 임시 로그인 유저 ID (나중엔 JWT로 대체 가능)
def get_current_user_id():
    return 1  # 지금은 테스트용. 로그인된 유저라고 가정.

# 게시글 작성
@routers.post("/", response_model=PostResponse)
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

# ---------------------- 게시글 상세 ----------------------
@routers.get("/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id, Post.is_deleted == False).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.views += 1
    db.commit()
    db.refresh(post)

    # 좋아요/싫어요 수 계산
    likes = sum(1 for r in post.reactions if r.reaction_type.value == "like")
    dislikes = sum(1 for r in post.reactions if r.reaction_type.value == "dislike")

    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "category": post.category,
        "views": post.views,
        "likes": likes,
        "dislikes": dislikes,
        "created_date": post.created_date,
        "updated_date": post.updated_date
    }

# ---------------------- 조회수 순 게시글 목록 ----------------------
@routers.get("/")
def get_posts_ordered_by_views(db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.is_deleted == False).order_by(Post.views.desc()).all()
    return posts

# ---------------------- 좋아요 / 싫어요 ----------------------
@routers.post("/{post_id}/reaction")
def toggle_reaction(post_id: int,
                    reaction_type: ReactionType,
                    user_id: int,
                    db: Session = Depends(get_db)):
    
    # 게시글 존재 확인
    post = db.query(Post).filter(Post.id == post_id, Post.is_deleted == False).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # 유저 존재 확인
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 기존 반응 확인
    existing_reaction = (
        db.query(Reaction)
        .filter(Reaction.post_id == post_id, Reaction.user_id == user_id)
        .first()
    )

    # 기존 반응이 없는 경우 → 새로 추가
    if not existing_reaction:
        new_reaction = Reaction(
            post_id=post_id,
            user_id=user_id,
            reaction_type=reaction_type
        )
        db.add(new_reaction)
        db.commit()
        db.refresh(new_reaction)
        return {"message": f"{reaction_type.value} 등록 완료!"}

    # 이미 같은 타입으로 눌러져 있으면 → 취소 (toggle)
    if existing_reaction.reaction_type == reaction_type:
        db.delete(existing_reaction)
        db.commit()
        return {"message": f"{reaction_type.value} 취소됨"}

    # 다른 타입으로 바꾸는 경우 → 업데이트
    existing_reaction.reaction_type = reaction_type
    db.commit()
    return {"message": f"{reaction_type.value}로 변경됨"}