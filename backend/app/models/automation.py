from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Text
from sqlalchemy.sql import func
from ..database import Base

class AutomationJob(Base):
    __tablename__ = "automation_jobs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    job_type = Column(String, nullable=False)  # maintenance, testing, documentation, deployment
    status = Column(String, default="active")  # active, running, paused, error
    schedule = Column(String, nullable=True)  # Cron expression
    parameters = Column(JSON, default=dict)
    project_id = Column(Integer, nullable=True)
    created_by = Column(Integer, nullable=False)
    last_run = Column(DateTime, nullable=True)
    next_run = Column(DateTime, nullable=True)
    success_rate = Column(Integer, default=100)
    avg_duration = Column(Integer, default=0)  # seconds
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class JobExecution(Base):
    __tablename__ = "job_executions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, nullable=False)
    status = Column(String, default="pending")  # pending, running, completed, failed
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    duration = Column(Integer, nullable=True)  # seconds
    logs = Column(JSON, default=list)
    error_message = Column(Text, nullable=True)
    output = Column(JSON, default=dict)