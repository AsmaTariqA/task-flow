from fastapi import UploadFile
from app.utils.supabase_client import supabase

BUCKET_NAME = "task-files"

async def save_file(file: UploadFile):
    # Read file content
    content = await file.read()
    
    # Upload to Supabase Storage
    supabase.storage.from_(BUCKET_NAME).upload(file.filename, content)
    
    # Get public URL
    url = supabase.storage.from_(BUCKET_NAME).get_public_url(file.filename)
    
    return {"filename": file.filename, "url": url.public_url}
