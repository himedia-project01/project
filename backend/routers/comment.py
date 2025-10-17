from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.comment import Comment
from models.post import Post
from schemas.comment import CommentCreate, Comments, CommentUpdate

router = APIRouter(prefix='/comments', tags=["댓글"])

@router.get('/')
def get_comments(db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.is_deleted == False).all()

    db.close()

    return comments

#  CREATE - 댓글 추가

@router.post('/posts/{post_id}', response_model=CommentCreate)
def create_comment(post_id: int, comment: CommentCreate, db: Session = Depends(get_db)):

    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="해당 게시글를 찾을 수 없습니다.")

    new_comment = Comment(
        content = comment.content,
        post_id = comment.post_id,
        user_id = comment.user_id
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

#  READ - 특정 게시글의 모든 댓글 조회
@router.get("/posts/{post_id}", response_model=list[Comments])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="해당 게시글을 읽을 수 없습니다.")

    comments = db.query(Comment).filter(Comment.post_id == post_id).all()
    return comments


#  UPDATE - 댓글 수정
@router.put("/{comment_id}", response_model=Comments)
def update_comment(comment_id: int, updated: CommentUpdate, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.content = updated.content
    db.commit()
    db.refresh(comment)
    return comment


#  DELETE - 댓글 삭제
@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}