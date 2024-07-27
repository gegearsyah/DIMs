from firebase.initialize import messaging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.initialize import db

firebase_router  = APIRouter(prefix='/notification')

UserCollection = db['users']

# Pydantic model for notification data
class NotificationModel(BaseModel):
    title: str
    body: str
    token: str  # FCM device registration token

@firebase_router.post("/send_notification")
async def send_emergency_notification(phone_number: str):
    user_data = UserCollection.find_one({"phone_number": phone_number}, {})
    
    if user_data is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Create a message to send to the device
        message = messaging.Message(
            notification=messaging.Notification(
                title="Emergency!",
                body="USER WITH PHONE NUMBER" + user_data.get('phone_number') + " NEED YOUR IMMEDIATE ACTION",
            ),
            token="",
        )

        # Send the message
        response = messaging.send(message)
        return {"message": "Notification sent successfully", "response": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))