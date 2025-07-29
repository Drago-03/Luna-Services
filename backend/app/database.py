"""
Database configuration for Luna Services
Supports both SQLAlchemy ORM and Supabase for different use cases
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from supabase import create_client, Client
import os

# Supabase configuration
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://tnmsadjdeenhysllhyzp.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY", "")

# PostgreSQL configuration for SQLAlchemy ORM
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres.tnmsadjdeenhysllhyzp:JglPPLffmXPYaDzS@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
)

# SQLAlchemy setup for ORM operations
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

# Supabase client for real-time features and advanced operations
def get_supabase_client(service_role: bool = False) -> Client:
    """
    Get Supabase client with appropriate permissions
    
    Args:
        service_role: If True, uses service role key for admin operations
                     If False, uses anon key for user operations
    """
    key = SUPABASE_SERVICE_KEY if service_role else SUPABASE_ANON_KEY
    return create_client(SUPABASE_URL, key)

# Global Supabase clients
supabase_admin: Client = get_supabase_client(service_role=True)
supabase_client: Client = get_supabase_client(service_role=False)

async def init_db():
    """Initialize database tables using SQLAlchemy"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    """Dependency to get SQLAlchemy database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def get_supabase():
    """Dependency to get Supabase client (anon key)"""
    return supabase_client

def get_supabase_admin():
    """Dependency to get Supabase admin client (service role key)"""
    return supabase_admin