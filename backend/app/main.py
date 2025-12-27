from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth
from app.routers import projects
from app.routers import tasks
from app.routers import files



app = FastAPI(title="TaskFlow API (dev)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(files.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "TaskFlow API running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
