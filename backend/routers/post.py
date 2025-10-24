from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from models.user import User
from models.post import Post, Reaction, ReactionType
from schemas.post import PostCreate, PostResponse
from typing import List

router = APIRouter(prefix = '/posts', tags=["게시글 관리"])

# 임시 로그인 유저 ID (나중엔 JWT로 대체 가능)
def get_current_user_id():
    return 1  # 테스트용. 로그인된 유저라고 가정.

# 게시글 작성
@router.post("/create", response_model=PostResponse)
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

# 게시글 조회
@router.get("/read/{post_id}", response_model=List[PostResponse])
def search_posts(keyword: str = Query(..., description="검색 키워드"),
                 db: Session = Depends(get_db)):
    # title 또는 content에 keyword가 포함된 게시글 검색
    posts = db.query(Post).filter(
        or_(
            Post.title.ilike(f"%{keyword}%"),   # 대소문자 구분 없이 검색
            Post.content.ilike(f"%{keyword}%")
        )
    ).all()

    return posts

# 게시글 업데이트
@router.put("/update/{post_id}", response_model=PostResponse)
def update_post(post_id: int,
                updated_post: PostCreate,
                user_id: int = Depends(get_current_user_id),
                db: Session = Depends(get_db)):

    post = db.query(Post).filter(Post.id == post_id, Post.is_deleted == False).first()

    if not post:
        raise HTTPException(status_code=404, detail="❌ 존재하지 않는 게시글입니다.")

    if post.user_id != user_id:
        raise HTTPException(status_code=403, detail="⛔ 접근 권한이 없습니다.")

    post.title = updated_post.title
    post.content = updated_post.content
    post.category = updated_post.category
    db.commit()
    db.refresh(post)

    return post

# 게시글 삭제
@router.delete("/delete/{post_id}")
def delete_post(post_id: int,
                user_id: int = Depends(get_current_user_id),
                db: Session = Depends(get_db)):

    post = db.query(Post).filter(Post.id == post_id, Post.is_deleted == False).first()

    if not post:
        raise HTTPException(status_code=404, detail="❌ 존재하지 않는 게시글입니다.")

    if post.user_id != user_id:
        raise HTTPException(status_code=403, detail="⛔ 접근 권한이 없습니다.")

    post.is_deleted = True
    db.commit()

    return {"message": f"Post {post_id} 삭제 완료"}

# 조회수 순 게시글 목록
@router.get("/")
def get_posts_ordered_by_views(db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.is_deleted == False).order_by(Post.views.desc()).all()
    return posts

# 좋아요 / 싫어요
@router.post("/{post_id}/reaction")
def toggle_reaction(post_id: int,
                    reaction_type: ReactionType,
                    user_id: int,
                    db: Session = Depends(get_db)):
    
    # 게시글 존재 확인
    post = db.query(Post).filter(Post.id == post_id, Post.is_deleted == False).first()
    if not post:
        raise HTTPException(status_code=404, detail="❌ 존재하지 않는 게시글입니다.")

    # 유저 존재 확인
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="❗ 일치하는 회원 정보가 없습니다.")

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