from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

automation_router = APIRouter()

class AutomationJob(BaseModel):
    id: str
    name: str
    description: str
    job_type: str
    status: str
    schedule: str
    project_id: Optional[str] = None
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    success_rate: float
    avg_duration: int
    created_at: datetime

class CreateJobRequest(BaseModel):
    name: str
    description: str
    job_type: str
    schedule: str
    parameters: dict = {}

# Mock data
MOCK_JOBS = [
    {
        "id": "1",
        "name": "Daily Backup",
        "description": "Automated database backup every day at 2 AM",
        "job_type": "maintenance",
        "status": "active",
        "schedule": "0 2 * * *",
        "project_id": "1",
        "last_run": datetime.now(),
        "next_run": datetime.now(),
        "success_rate": 98.5,
        "avg_duration": 120,
        "created_at": datetime.now()
    }
]

@automation_router.get("/jobs", response_model=List[AutomationJob])
async def get_jobs():
    """Get all automation jobs"""
    return MOCK_JOBS

@automation_router.post("/jobs", response_model=AutomationJob)
async def create_job(request: CreateJobRequest):
    """Create a new automation job"""
    new_job = {
        "id": str(len(MOCK_JOBS) + 1),
        "name": request.name,
        "description": request.description,
        "job_type": request.job_type,
        "status": "active",
        "schedule": request.schedule,
        "project_id": None,
        "last_run": None,
        "next_run": None,
        "success_rate": 100.0,
        "avg_duration": 0,
        "created_at": datetime.now()
    }
    
    MOCK_JOBS.append(new_job)
    return new_job

@automation_router.get("/jobs/{job_id}", response_model=AutomationJob)
async def get_job(job_id: str):
    """Get specific automation job"""
    job = next((j for j in MOCK_JOBS if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@automation_router.put("/jobs/{job_id}/run")
async def run_job(job_id: str):
    """Manually trigger job execution"""
    job = next((j for j in MOCK_JOBS if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Simulate job execution
    job["status"] = "running"
    job["last_run"] = datetime.now()
    
    return {"message": "Job started successfully", "execution_id": "exec-123"}

@automation_router.put("/jobs/{job_id}/pause")
async def pause_job(job_id: str):
    """Pause job execution"""
    job = next((j for j in MOCK_JOBS if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job["status"] = "paused"
    return {"message": "Job paused successfully"}