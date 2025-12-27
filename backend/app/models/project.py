from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime

tasks = relationship("Task", back_populates="project", cascade="all, delete")

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    owner_id: Optional[UUID4] = None  # allow omission by client

    class Config:
        schema_extra = {
            "example": {
                "name": "Website Redesign",
                "description": "Redesign company website",
                # owner_id can be omitted from client request
            }
        }

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: UUID4
    owner_id: Optional[UUID4]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
