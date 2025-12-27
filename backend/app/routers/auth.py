from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import AuthService
from app.utils.security import get_current_user

router = APIRouter()

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """
    Register a new user

    - **email**: User's email address
    - **password**: Strong password (min 6 characters)
    - **full_name**: User's full name (optional)
    """
    service = AuthService()
    return await service.signup(user_data)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Login with email and password

    Returns JWT access token
    """
    service = AuthService()
    return await service.login(credentials)

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user's information

    Requires: Bearer token in Authorization header
    """
    service = AuthService()
    return await service.get_user_by_id(current_user["sub"])

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout current user
    Note: With JWT, logout is handled client-side by removing token
    """
    return {"message": "Logged out successfully"}
