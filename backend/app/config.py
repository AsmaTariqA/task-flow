from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    use_supabase: bool = False       # optional, default False
    storage_bucket: str = "task-files"  # optional default
    jwt_secret: str = ""  # optional, add if you need JWT_SECRET
    cors_origins: list[str] = ["http://localhost:3000"]  # CORS allowed origins

    class Config:
        env_file = ".env"
        extra = "allow"  # allow extra env vars like JWT_SECRET


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
