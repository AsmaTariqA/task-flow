from os import getenv
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

SUPABASE_URL = getenv("SUPABASE_URL")
SUPABASE_KEY = getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Sign in as test user
email = "asma.test3@gmail.com"
password = "TestPass123!"

auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})
access_token = auth_response.session.access_token
print("Access Token:", access_token)

# File path on Desktop
file_path = r"C:\Users\Asma\Desktop\testfile.txt"  # <-- full path
bucket_name = "task-files"
file_name_in_bucket = "testfile.txt"

try:
    with open(file_path, "rb") as f:
        response = supabase.storage.from_(bucket_name).upload(
            path=file_name_in_bucket,
            file=f
        )
    print("Upload response:", response)
except Exception as e:
    print("Upload failed:", e)

# Optional: List files to verify
try:
    files = supabase.storage.from_(bucket_name).list()
    print("Files in bucket:", files)
except Exception as e:
    print("Failed to list files:", e)
