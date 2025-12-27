from fastapi import APIRouter, UploadFile, File, HTTPException, status, Query
import uuid
from pathlib import Path
from app.utils.supabase_client import get_service_client

router = APIRouter(prefix="/files", tags=["files"])

BUCKET_NAME = "task-files"
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png", ".gif", ".csv", ".xlsx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

supabase = get_service_client()

def validate_file_extension(filename: str):
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

async def validate_file_size(file: UploadFile):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    await file.seek(0)
    return content

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_file(
    task_id: str = Query(...),
    user_id: str | None = Query(None),
    file: UploadFile = File(...)
):
    try:
        validate_file_extension(file.filename)
        content = await validate_file_size(file)

        unique_filename = f"{uuid.uuid4()}{Path(file.filename).suffix}"

        # ✅ Storage upload returns UploadResponse, not dict
        try:
            res = supabase.storage.from_(BUCKET_NAME).upload(unique_filename, content)
            # Check if upload was successful (no exception means success)
        except Exception as storage_error:
            raise HTTPException(
                status_code=500, 
                detail=f"Storage upload failed: {str(storage_error)}"
            )

        # ✅ Get public URL
        url = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)

        # ✅ Insert DB record - .execute() returns a response object
        try:
            record = supabase.table("task_files").insert({
                "task_id": task_id,
                "file_name": file.filename,
                "file_path": unique_filename,
                "file_type": Path(file.filename).suffix,
                "file_size": len(content),
                "uploaded_by": user_id
            }).execute()
            
            # Check for errors in the response
            if hasattr(record, 'data') and not record.data:
                raise HTTPException(status_code=500, detail="Failed to insert file record")
                
        except Exception as db_error:
            # Cleanup: delete uploaded file if DB insert fails
            try:
                supabase.storage.from_(BUCKET_NAME).remove([unique_filename])
            except:
                pass
            raise HTTPException(
                status_code=500,
                detail=f"Database insert failed: {str(db_error)}"
            )

        return {
            "message": "File uploaded successfully",
            "data": {
                "task_id": task_id,
                "file_name": file.filename,
                "file_path": unique_filename,
                "url": url,
                "size": len(content)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))