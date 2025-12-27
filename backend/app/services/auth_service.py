from app.utils.supabase_client import get_anon_client
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.utils.security import create_access_token
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self):
        self.supabase = get_anon_client()

    async def signup(self, user_data: UserCreate) -> Token:
        """
        Register new user with Supabase Auth
        """
        try:
            # Create user in Supabase Auth
            response = self.supabase.auth.sign_up({
                "email": user_data.email,
                "password": user_data.password,
                "options": {
                    "data": {
                        "full_name": user_data.full_name
                    }
                }
            })

            if not response.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create user"
                )

            # Create access token
            access_token = create_access_token(
                data={"sub": str(response.user.id), "email": response.user.email}
            )

            user_response = UserResponse(
                id=response.user.id,
                email=response.user.email,
                full_name=user_data.full_name,
                created_at=response.user.created_at
            )

            return Token(access_token=access_token, user=user_response)

        except Exception as e:
            logger.error(f"Signup error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Signup failed: {str(e)}"
            )

    async def login(self, credentials: UserLogin) -> Token:
        """
        Login user and return access token
        """
        try:
            response = self.supabase.auth.sign_in_with_password({
                "email": credentials.email,
                "password": credentials.password
            })

            if not response.user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            # Create access token
            access_token = create_access_token(
                data={"sub": str(response.user.id), "email": response.user.email}
            )

            user_response = UserResponse(
                id=response.user.id,
                email=response.user.email,
                full_name=response.user.user_metadata.get("full_name"),
                created_at=response.user.created_at
            )

            return Token(access_token=access_token, user=user_response)

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

    async def get_user_by_id(self, user_id: str) -> UserResponse:
        """
        Get user details by ID
        """
        try:
            response = self.supabase.auth.admin.get_user_by_id(user_id)
            return UserResponse(
                id=response.user.id,
                email=response.user.email,
                full_name=response.user.user_metadata.get("full_name"),
                created_at=response.user.created_at
            )
        except Exception as e:
            logger.error(f"Get user error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )