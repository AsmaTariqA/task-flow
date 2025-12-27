from app.utils.supabase_client import get_service_client
import uuid

# Initialize Supabase service client
client = get_service_client()

class ProjectService:
    @staticmethod
    def create_project(project_data: dict):
        """
        Create a new project in Supabase.

        Ensures a unique ID is assigned if not provided.
        """
        if "id" not in project_data:
            project_data["id"] = str(uuid.uuid4())

        res = client.table("project").insert(project_data).execute()
        return res.data

    @staticmethod
    def get_projects_by_owner(owner_id: str):
        """
        Retrieve all projects belonging to a specific user.
        """
        res = client.table("project").select("*").eq("owner_id", owner_id).execute()
        return res.data

    @staticmethod
    def update_project(project_id: str, update_data: dict):
        """
        Update project fields by project ID.
        """
        res = client.table("project").update(update_data).eq("id", project_id).execute()
        return res.data

    @staticmethod
    def delete_project(project_id: str):
        """
        Delete a project by project ID.
        """
        res = client.table("project").delete().eq("id", project_id).execute()
        return res.data
