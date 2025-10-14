import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import SQLAlchemyError

load_dotenv()
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "database_name")

DB_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DB_URL, echo=True, pool_pre_ping=True,)

SessionLocal = sessionmaker(autocommit=False,
                            autoflush=False,
                            bind=engine)

Base = declarative_base()

def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("database tables created successfully")
    except SQLAlchemyError as e:
        print("Error creating tables", e)

def get_db():
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        print("❌ Database error:", e)
        db.rollback()
        raise
    finally:
        db.close()