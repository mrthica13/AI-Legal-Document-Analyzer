from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base

# Models
from app.models.user import User
from app.models.document import Document

# Routers
from app.api.user import router as user_router
from app.api.upload import router as upload_router
from app.api.document import router as document_router
from app.api.dashboard import router as dashboard_router
from app.api.view import router as view_router

app = FastAPI(
    title="AI Legal Document Analyzer",
    description="FastAPI Backend for AI Legal Document Analyzer",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(user_router)
app.include_router(upload_router)
app.include_router(document_router)
app.include_router(dashboard_router)
app.include_router(view_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Legal Document Analyzer API"
    }