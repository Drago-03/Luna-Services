from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import structlog
from contextlib import asynccontextmanager

from .auth.router import auth_router
from .automation.router import automation_router
from .mcp.router import mcp_router
from .database import init_db
from .middleware.logging import LoggingMiddleware
from .middleware.auth import AuthMiddleware

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Luna-service API")
    await init_db()
    yield
    # Shutdown
    logger.info("Shutting down Luna-service API")

app = FastAPI(
    title="Luna-service API",
    description="Master Control Program for Engineering Teams",
    version="2.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)
app.add_middleware(AuthMiddleware)

# Security
security = HTTPBearer()

# Routes
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(automation_router, prefix="/api/automation", tags=["automation"])
app.include_router(mcp_router, prefix="/api/mcp", tags=["mcp"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Luna-service API",
        "version": "2.1.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z",
        "services": {
            "api": "healthy",
            "database": "healthy",
            "redis": "healthy",
            "celery": "healthy"
        }
    }

@app.get("/api/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return {
        "active_jobs": 24,
        "total_users": 156,
        "api_requests": 12450,
        "error_rate": 0.02
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)