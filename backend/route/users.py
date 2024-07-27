from typing import Optional
from model.users import UserInDB
from auth.auth import get_password_hash
from database.initialize import db

collection = db['users']

async def get_user(phone_number: str) -> Optional[UserInDB]:
    user = collection.find_one({"phone_number": phone_number})
    if user:
        return UserInDB(**user)

async def create_user(phone_number: str, password: str, full_name: Optional[str] = None, role: Optional[str] = None) -> UserInDB:
    hashed_password = get_password_hash(password)
    user = UserInDB(
        phone_number=phone_number,
        hashed_password=hashed_password,
        full_name=full_name,
        role=role
    )
    collection.insert_one(user.model_dump())
    return user