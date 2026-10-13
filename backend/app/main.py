"""
FastAPI Main Application Entry Point for Smart Salary Planner Backend.
"""

from app.api import api_router
from app.core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Smart Salary Planner API — Computational Thinking and Programming syllabus backend with Greedy, DP, Divide & Conquer, Backtracking, Branch & Bound, and Gemini AI.",
)

# Configure CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_STR,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
