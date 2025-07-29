from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext

auth_router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    user: dict
    token: str
    expires_at: datetime

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str
    permissions: list[str]
    avatar: Optional[str] = None
    department: str
    last_login: datetime

# Mock user for demo
DEMO_USER = {
    "id": "1",
    "name": "John Doe",
    "email": "admin@luna-service.com",
    "role": "admin",
    "permissions": ["read", "write", "admin"],
    "avatar": "",
    "department": "Engineering",
    "last_login": datetime.now()
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, "secret-key", algorithm="HS256")
    return encoded_jwt, expire

@auth_router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token"""
    
    # Demo authentication
    if request.email == "admin@luna-service.com" and request.password == "admin123":
        token, expires_at = create_access_token(
            data={"sub": DEMO_USER["email"], "user_id": DEMO_USER["id"]}
        )
        
        return LoginResponse(
            user=DEMO_USER,
            token=token,
            expires_at=expires_at
        )
    
    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )

@auth_router.get("/me", response_model=User)
async def get_current_user(token: str = Depends(security)):
    """Get current user information"""
    try:
        payload = jwt.decode(token.credentials, "secret-key", algorithms=["HS256"])
        email = payload.get("sub")
        
        if email == DEMO_USER["email"]:
            return User(**DEMO_USER)
            
    except jwt.PyJWTError:
        pass
    
    raise HTTPException(
        status_code=401,
        detail="Invalid token"
    )

@auth_router.post("/refresh")
async def refresh_token(token: str = Depends(security)):
    """Refresh JWT token"""
    try:
        payload = jwt.decode(token.credentials, "secret-key", algorithms=["HS256"])
        email = payload.get("sub")
        
        if email == DEMO_USER["email"]:
            new_token, expires_at = create_access_token(
                data={"sub": email, "user_id": DEMO_USER["id"]}
            )
            
            return {
                "token": new_token,
                "expires_at": expires_at
            }
            
    except jwt.PyJWTError:
        pass
    
    raise HTTPException(
        status_code=401,
        detail="Invalid token"
    )