import firebase_admin
from firebase_admin import credentials, messaging
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel

firebase_router = FastAPI()

# Path to your service account key
SERVICE_ACCOUNT_KEY_PATH = "path/to/your/firebase-service-account.json"

# Initialize Firebase Admin SDK
cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
firebase_admin.initialize_app(cred)

# Pydantic model for notification data
class NotificationModel(BaseModel):
    title: str
    body: str
    token: str  # FCM device registration token

@app.post("/send_notification")
async def send_notification(notification: NotificationModel):
    try:
        # Create a message to send to the device
        message = messaging.Message(
            notification=messaging.Notification(
                title=notification.title,
                body=notification.body,
            ),
            token=notification.token,
        )

        # Send the message
        response = messaging.send(message)
        return {"message": "Notification sent successfully", "response": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Running the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)