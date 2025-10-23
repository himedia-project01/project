from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from schemas.user import UserCreate, UserResponse, UserRead, UserUpdate, UserBase
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# JWT 토큰 발급
def create_token(user: UserBase):
    payload = {
        "user_id" : user.id,
        "user_nickname" : user.nickname,
        "exp" : datetime.now(timezone.utc) + timedelta(minutes=1)  # 30분 
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

# JWT 토큰 검증
def verify_token(token:str):
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        return payload, None

    except jwt.ExpriedSignautreError:
        return None, 'expired'
    except JWTError:
        return None, 'invalid'