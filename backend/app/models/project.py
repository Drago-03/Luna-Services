from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Text
from sqlalchemy.sql import func
from ..database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    repository_url = Column(String, nullable=True)
    status = Column(String, default="active")  # active, archived, maintenance
    settings = Column(JSON, default=dict)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    role = Column(String, default="developer")  # owner, maintainer, developer, viewer
    joined_at = Column(DateTime, server_default=func.now())