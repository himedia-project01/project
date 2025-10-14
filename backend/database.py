from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# 환경변수 설정
load_dotenv()
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "database_name")

# URL 설정
DB_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# sqlite에 직접적으로 연결하는 연결 객체
def connect_db():
    conn = sqlite3.connect("./database.db")
    conn.row_factory = sqlite3.Row

    return conn


# 엔진
engine = create_engine(DB_URL,)

# 세션 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)       


# Base 모델
Base = declarative_base() 


# Base 모델에 등록된 모델 클래스를 생성해주는 create_table 함수 
def create_tables():
    """ORM 모델(파이썬 클래스)를 
    데이터 베이스 테이블로 생성하는 함수"""
    
    # engine과 연결된 데이터베이스에 데이터 베이스 테이블 생성
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try: 
        yield db    # yield가 포함되어 있는 함수는 generator 
    finally: 
        db.close()