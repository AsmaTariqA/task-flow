from supabase import create_client, Client
from fastapi import UploadFile, HTTPException, status
from typing import Optional
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "task-flow-files")


class SupabaseStorage:
    """Wrapper for Supabase storage operations"""
    
    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("Supabase credentials not configured")
        
        self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.bucket = STORAGE_BUCKET
    
    def ensure_bucket_exists(self):
        """Create bucket if it doesn't exist"""
        try:
            # Try to get bucket
            self.client.storage.get_bucket(self.bucket)
        except Exception:
            # Create bucket if it doesn't exist
            self.client.storage.create_bucket(
                self.bucket,
                options={"public": False}  # Set to True if files should be publicly accessible
            )
    
    async def upload_file(
        self,
        file: UploadFile,
        folder: str = "uploads",
        filename: Optional[str] = None
    ) -> dict:
        """
        Upload file to Supabase storage
        
        Args:
            file: FastAPI UploadFile object
            folder: Folder path in bucket
            filename: Custom filename (optional, uses original if not provided)
        
        Returns:
            dict with file info including public URL
        """
        try:
            # Read file content
            content = await file.read()
            
            # Determine filename
            upload_filename = filename or file.filename
            file_path = f"{folder}/{upload_filename}"
            
            # Upload to Supabase
            response = self.client.storage.from_(self.bucket).upload(
                path=file_path,
                file=content,
                file_options={
                    "content-type": file.content_type,
                    "upsert": "false"  # Set to "true" to overwrite existing files
                }
            )
            
            # Get public URL
            public_url = self.client.storage.from_(self.bucket).get_public_url(file_path)
            
            return {
                "filename": upload_filename,
                "path": file_path,
                "url": public_url,
                "size": len(content),
                "content_type": file.content_type
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error uploading to Supabase: {str(e)}"
            )
    
    def download_file(self, file_path: str) -> bytes:
        """Download file from Supabase storage"""
        try:
            response = self.client.storage.from_(self.bucket).download(file_path)
            return response
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File not found: {str(e)}"
            )
    
    def delete_file(self, file_path: str) -> dict:
        """Delete file from Supabase storage"""
        try:
            response = self.client.storage.from_(self.bucket).remove([file_path])
            return {"message": "File deleted successfully", "path": file_path}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting file: {str(e)}"
            )
    
    def list_files(self, folder: str = "") -> list:
        """List files in a folder"""
        try:
            response = self.client.storage.from_(self.bucket).list(folder)
            return response
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error listing files: {str(e)}"
            )
    
    def get_public_url(self, file_path: str) -> str:
        """Get public URL for a file"""
        return self.client.storage.from_(self.bucket).get_public_url(file_path)


# Singleton instance
_storage_instance = None

def get_storage() -> SupabaseStorage:
    """Get or create Supabase storage instance"""
    global _storage_instance
    if _storage_instance is None:
        _storage_instance = SupabaseStorage()
        _storage_instance.ensure_bucket_exists()
    return _storage_instance