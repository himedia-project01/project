from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse
# from passlib.context import CryptContext

router = APIRouter(prefix='/users', tags=["사용자 관리"])

# bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

# def get_password_has(password):
#     return bcrypt_context.hash(password)

# 전체 사용자 목록 조회
@router.get('')
def get_users(db: Session = Depends(get_db)):
    """전체 회원 목록 조회"""
    users = db.query(User).filter(User.is_deleted == False).all()

    db.close()

    return users

# 사용자 추가(회원가입)
@router.post('', response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """회원가입 로직"""

    # hashed_pw = get_password_has(user.password)

    user = User(
        name = user.name,
        email = user.email,
        password = user.password,
        nickname = user.nickname,
        gender = user.gender
        )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message" : "회원가입 성공"
        }
        

@router.get('/check-email/{email}')
def valid_email(email: str, db: Session = Depends(get_db)):
    """이메일 중복검사"""
    user = db.query(User).filter(User.email == email).first()

    if user:
        raise HTTPException(status_code=409, detail="이미 가입된 이메일입니다.")

@router.get('/check-nickname/{nickname}')
def valid_nickname(nickname: str, db: Session = Depends(get_db)):
    """닉네임 중복검사"""
    user = db.query(User).filter(User.nickname == nickname).first()

    if user:
        raise HTTPException(status_code=409, detail="이미 존재하는 닉네임입니다.")

# 사용자 정보 수정페이지로 이동
@router.get('/modify')
def get_info(id:int, db: Session = Depends(get_db)):
    """사용자 정보 수정하는 페이지로 이동하는 로직"""
    user = db.query(User).filter(User.id == id).filter(User.is_deleted == False).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    return user

# 사용자 정보 수정
@router.patch('/modify')
def update_user_info(id:int, password: str, nickname: str, gender: str, db: Session = Depends(get_db)):
    """사용자 정보 수정하는 로직"""
    user = db.query(User).filter(User.id == id).filter(User.is_deleted == False).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    user.password = password
    user.nickname = nickname
    user.gender = gender

    db.commit()
    db.refresh(user)

    return user


# 사용자 삭제
@router.patch('/delete')
def delete_user(id:int, db: Session = Depends(get_db)):
    """회원탈퇴 로직"""

    user = db.query(User).filter(User.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    user.is_deleted = True

    db.commit()
    db.refresh(user)

    return user
    