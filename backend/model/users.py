from pydantic import BaseModel
from typing import Optional

class UserInDB(BaseModel):
    phone_number: str
    hashed_password: str
    full_name: Optional[str] = None
    role: Optional[str] = None

class User(BaseModel):
    phone_number: str
    full_name: Optional[str] = None
    role: Optional[str] = None