from fastapi import FastAPI
from route.polygons import polygons_router
from route.markers import markers_router
import uvicorn

app = FastAPI()

app.include_router(polygons_router, prefix="/api")
app.include_router(markers_router, prefix="/api")

if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8000)