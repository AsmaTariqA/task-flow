from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    project_id: UUID
    title: str
    description: str
    status: str
    assigned_to: Optional[UUID] = None
    priority: str

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None

class TaskResponse(BaseModel):
    id: UUID
    project_id: UUID
    title: str
    description: str
    status: str
    created_by: UUID
    created_at: datetime
    assigned_to: Optional[UUID] = None
    updated_at: datetime
    priority: str
