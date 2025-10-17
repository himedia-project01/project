import uvicorn
from fastapi import FastAPI
from database import create_tables, get_db

from routers import user,comment

app = FastAPI()

app.include_router(user.router)
app.include_router(comment.router)
@app.on_event("startup")
def startup_event():
    create_tables()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
