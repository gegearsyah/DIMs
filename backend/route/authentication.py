from fastapi import HTTPException, Depends,APIRouter
from pydantic import BaseModel
from typing import Optional
from .users import create_user, get_user
from auth.auth import create_access_token, decode_jwt, verify_password

authentication_router = APIRouter(prefix='/auth')

class UserCreate(BaseModel):
    phone_number: str
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    phone_number: str
    password: str

@authentication_router.post("/register/")
async def register(user: UserCreate):
    existing_user = await get_user(user.phone_number)
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    await create_user(
        user.phone_number,
        user.password,
        full_name=user.full_name,
        role=user.role
    )
    return {
        "status":"ok",
        "message": "User created"
    }
        

@authentication_router.post("/token/")
async def login(user: UserLogin):
    db_user = await get_user(user.phone_number)
    if db_user and verify_password(user.password, db_user.hashed_password):
        access_token = create_access_token(data={"sub": user.phone_number})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@authentication_router.get("/users/me/")
async def read_users_me(token: str):
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    phone_number = payload.get("sub")
    user = await get_user(phone_number)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user