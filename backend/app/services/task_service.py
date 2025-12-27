# app/services/task_service.py
from app.utils.supabase_client import get_service_client
from app.models.task import TaskCreate, TaskResponse, TaskUpdate
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List

# Initialize Supabase service client
client = get_service_client()

class TaskService:
    @staticmethod
    def create_task(payload: TaskCreate, created_by: Optional[UUID] = None) -> TaskResponse:
        now = datetime.utcnow()
        task_id = str(uuid4())  # generate a new v4 UUID for task

        # If created_by not provided, fetch project owner
        if created_by is None:
            project_res = client.table("projects").select("owner_id").eq("id", str(payload.project_id)).execute()
            if not project_res.data or len(project_res.data) == 0:
                raise Exception("Project not found")
            created_by = project_res.data[0]["owner_id"]

        task_data = {
            "id": task_id,
            "project_id": str(payload.project_id),
            "title": payload.title,
            "description": payload.description,
            "status": payload.status,
            "priority": payload.priority,
            "assigned_to": str(payload.assigned_to) if getattr(payload, "assigned_to", None) else None,
            "created_by": str(created_by),
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }

        res = client.table("tasks").insert(task_data).execute()
        if res.data:
            return TaskResponse(**res.data[0])
        raise Exception("Failed to create task")

    @staticmethod
    def get_task(task_id: UUID) -> Optional[TaskResponse]:
        res = client.table("tasks").select("*").eq("id", str(task_id)).execute()
        if res.data:
            return TaskResponse(**res.data[0])
        return None

    @staticmethod
    def list_tasks(project_id: UUID) -> List[TaskResponse]:
        res = client.table("tasks").select("*").eq("project_id", str(project_id)).execute()
        return [TaskResponse(**task) for task in res.data]

    @staticmethod
    def update_task(task_id: UUID, payload: TaskUpdate) -> Optional[TaskResponse]:
        update_data = payload.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        if "assigned_to" in update_data and update_data["assigned_to"]:
            update_data["assigned_to"] = str(update_data["assigned_to"])

        res = client.table("tasks").update(update_data).eq("id", str(task_id)).execute()
        if res.data:
            return TaskResponse(**res.data[0])
        return None

    @staticmethod
    def delete_task(task_id: UUID) -> bool:
        res = client.table("tasks").delete().eq("id", str(task_id)).execute()
        return len(res.data) > 0
