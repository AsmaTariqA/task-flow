# app/routers/projects.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime
import uuid

from app.utils.supabase_client import get_service_client
from app.utils.security import get_current_user  # real auth dependency

client = get_service_client()
router = APIRouter(prefix="/api/projects", tags=["projects"])

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass  # owner_id will come from JWT

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: UUID4
    owner_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate, current_user: dict = Depends(get_current_user)
):
    payload = project.dict()
    # JWT user ID is usually in 'sub'
    payload["owner_id"] = str(current_user["sub"])
    payload["id"] = str(uuid.uuid4())
    now = datetime.utcnow()
    payload["created_at"] = now.isoformat()
    payload["updated_at"] = now.isoformat()

    res = client.table("projects").insert(payload).execute()

    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create project")

    return res.data[0]


@router.get("/", response_model=List[ProjectResponse])
async def list_my_projects(current_user=Depends(get_current_user)):
    owner_id = str(current_user["id"])
    res = client.table("projects").select("*").eq("owner_id", owner_id).execute()

    if res.data is None:
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

    return res.data

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, update_data: ProjectUpdate, current_user=Depends(get_current_user)):
    payload = update_data.dict(exclude_unset=True)
    payload["updated_at"] = datetime.utcnow().isoformat()
    res = client.table("projects").update(payload).eq("id", project_id).eq("owner_id", str(current_user["id"])).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Project not found")

    return res.data[0]

@router.delete("/{project_id}", response_model=ProjectResponse)
async def delete_project(project_id: str, current_user=Depends(get_current_user)):
    res = client.table("projects").delete().eq("id", project_id).eq("owner_id", str(current_user["id"])).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Project not found")

    return res.data[0]
