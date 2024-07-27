from typing import Optional
from pydantic import BaseModel
import google.generativeai as genai

class ChatPayload(BaseModel):
    chat_id: Optional[int]
    user_id: Optional[int]
    chat_history: genai.ChatSession

    class Config:
        arbitrary_types_allowed = True
