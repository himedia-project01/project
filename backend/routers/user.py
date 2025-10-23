from fastapi import APIRouter, Depends, HTTPException, Cookie, Response
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse, UserRead, UserUpdate, UserBase
from passlib.context import CryptContext
from jwt_token import create_token, verify_token


router = APIRouter(prefix='/users', tags=["사용자 관리"])

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

# 비밀번호 해시값 변환
def get_password_has(password):
    return bcrypt_context.hash(password)

# 로그인
@router.post('/login')
def login(user: UserRead, db: Session = Depends(get_db)):
    """로그인 로직"""

    res_user = db.query(User).filter(User.email == user.email).filter(User.is_deleted == False).first()

    if not res_user:
        raise HTTPException(status_code=404, detail="아이디를 확인해주세요")

    # print("아이디 검사 통과")

    is_valid = bcrypt_context.verify(user.password, res_user.password)

    # print("비밀번호 검증 통과")

    if not is_valid:
        raise HTTPException(status_code=404, detail="로그인 정보가 일치하지 않습니다.")

    token = create_token(res_user)

    res = Response()
    res.set_cookie(
        key="access_token",
        value=token,
        max_age= 3 * 60,   # 3분
        httponly=True,
        secure=False
    )

    return res

# 로그인 상태 확인
@router.get('/me')
def login_check(access_token: str = Cookie(None), db: Session = Depends(get_db)):
    """로그인 상태인지 확인하는 로직"""
    if not access_token:
        raise HTTPException(status_code=404, detail="일치하는 토큰을 찾을 수 없습니다.")


# 사용자 추가(회원가입)
@router.post('/join')
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """회원가입 로직"""

    hashed_pw = get_password_has(user.password)

    user = User(
        name = user.name,
        email = user.email,
        password = hashed_pw,
        nickname = user.nickname,
        birth = user.birth,
        gender = user.gender
        )

    db.add(user)
    db.commit()

    return {
        "message" : "회원가입 성공",
        }

    # res = RedirectResponse(url='/users/login', status_code=302)
    # return res
        
# 이메일 중복검사
@router.get('/check-email/{email}')
def valid_email(email: str, db: Session = Depends(get_db)):
    """이메일 중복검사"""
    user = db.query(User).filter(User.email == email).first()

    if user:
        raise HTTPException(status_code=409, detail="이미 가입된 이메일입니다.")

# 닉네임 중복검사
@router.get('/check-nickname/{nickname}')
def valid_nickname(nickname: str, db: Session = Depends(get_db)):
    """닉네임 중복검사"""
    user = db.query(User).filter(User.nickname == nickname).first()

    if user:
        raise HTTPException(status_code=409, detail="이미 존재하는 닉네임입니다.")

# 사용자 정보 수정페이지로 이동
@router.get('/modify')
def get_info(access_token: str = Cookie(None), db: Session = Depends(get_db)):
    """사용자 정보 수정하는 페이지로 이동하는 로직"""

    # JWT 토큰 확인 
    if not access_token:
        raise HTTPException(status_code=404, detail="일치하는 토큰을 찾을 수 없습니다.")

    # JWT 토큰 검증
    payload, error = verify_token(access_token)

    if error == 'expired':
        raise HTTPException(status_code=422, detail='세션이 만료되었습니다.')

    if error == 'invalid':
        raise HTTPException(status_code=422, detail='유효하지 않은 토큰입니다')

    id = payload.get("user_id")

    # 테스트용
    # id = 1


    user = db.query(User).filter(User.id == id).filter(User.is_deleted == False).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    return user

# 사용자 정보 수정
@router.patch('/modify')
def update_user_info(user: UserUpdate, access_token: str = Cookie(None),  db: Session = Depends(get_db)):
    """사용자 정보 수정하는 로직"""

    # JWT 토큰 확인 
    if not access_token:
        raise HTTPException(status_code=404, detail="일치하는 토큰을 찾을 수 없습니다.")

    # JWT 토큰 검증
    payload, error = verify_token(access_token)

    if error == 'expired':
        raise HTTPException(status_code=422, detail='세션이 만료되었습니다.')

    if error == 'invalide':
        raise HTTPException(status_code=422, detail='유효하지 않은 토큰입니다')

    id = payload.get("user_id")

    user = db.query(User).filter(User.id == id).filter(User.is_deleted == False).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    user.password = password
    user.nickname = nickname
    user.gender = gender
    user.birth = birth

    db.commit()
    db.refresh(user)

    return user


# 사용자 삭제
@router.patch('/delete')
def delete_user(access_token: str = Cookie(None), db: Session = Depends(get_db)):
    """회원탈퇴 로직"""

    # JWT 토큰 확인 
    if not access_token:
        raise HTTPException(status_code=422, detail="로그인 후 탈퇴 가능합니다.")

    # JWT 토큰 검증
    payload, error = verify_token(access_token)

    if error == 'expired':
        raise HTTPException(status_code=422, detail='세션이 만료되었습니다.')

    if error == 'invalide':
        raise HTTPException(status_code=422, detail='유효하지 않은 토큰입니다')

    id = payload("user_id", None)

    user = db.query(User).filter(User.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당 회원을 찾을 수 없습니다.")

    user.is_deleted = True

    db.commit()
    db.refresh(user)

    return user

@router.get('/logout')
def logout(res: Response, access_token: str = Cookie(None)):

    res = Response()
    res.delete_cookie('access_token')

    return res

