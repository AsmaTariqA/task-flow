from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
from typing import List
from app.models.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])
task_service = TaskService()

# You can later replace this with actual authentication dependency
# e.g., get_current_user() that returns the logged-in user's UUID
def get_current_user_id():
    return None  # Optional: None means service will pick project owner


@router.post("/", response_model=TaskResponse)
def create_task(payload: TaskCreate, current_user_id: UUID = Depends(get_current_user_id)):
    task = task_service.create_task(payload, created_by=current_user_id)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: UUID):
    task = task_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/project/{project_id}", response_model=List[TaskResponse])
def get_tasks_for_project(project_id: UUID):
    res = task_service.list_tasks(project_id)
    return res  # No need for res.error handling; TaskService returns list


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: UUID, payload: TaskUpdate):
    task = task_service.update_task(task_id, payload)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}")
def delete_task(task_id: UUID):
    res = task_service.delete_task(task_id)
    return {"success": res}
