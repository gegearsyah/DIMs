from fastapi import APIRouter, File, UploadFile
from typing import List
import imghdr
import uuid
import os

media_router = APIRouter(prefix='/media')

@media_router.post("/upload/")
async def upload_image(files: List[UploadFile] = File(...)):
    for file in files:
        # Check the file extension
        if file.content_type not in ["image/png", "image/jpeg"]:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}")

        # Check the file content
        contents = await file.read()
        if imghdr.what(None, contents) not in ['jpeg', 'png']:
            raise HTTPException(status_code=400, detail="Invalid image content")

        # Generate a random filename
        file_extension = file.filename.split('.')[-1]
        random_filename = f"{uuid.uuid4()}.{file_extension}"

        # Save the file
        with open(f"uploads/{random_filename}", "wb") as f:
            f.write(contents)

    return {"message": "Files successfully uploaded", "filename": "/public/"+random_filename}