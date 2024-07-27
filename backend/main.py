from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from route.polygons import polygons_router
from route.markers import markers_router
from route.authentication import authentication_router
from route.chatbot import chatbot_router
from route.media import media_router
import uvicorn
import os
# Ensure the uploads directory exists
os.makedirs('uploads', exist_ok=True)


app = FastAPI()

app.include_router(polygons_router, prefix="/api")
app.include_router(markers_router, prefix="/api")
app.include_router(chatbot_router, prefix="/api")
app.include_router(authentication_router, prefix="/api")
app.include_router(media_router, prefix="/api")

app.mount("/public", StaticFiles(directory="uploads"), name="public")

if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8000)