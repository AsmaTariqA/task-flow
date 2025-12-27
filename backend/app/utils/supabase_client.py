from supabase import create_client
from app.config import settings

def get_anon_client():
    return create_client(settings.supabase_url, settings.supabase_key)

def get_service_client():
    return create_client(settings.supabase_url, settings.supabase_service_key)
