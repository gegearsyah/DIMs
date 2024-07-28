## Disaster Interactive Maps (DIMs)

This Mobile app User React Native as Front-End and FastApi as Back-End

## Requirements
- Python 3.8+
- Other dependencies specified in `requirements.txt`
- MongoDb
- node.js
- Android Studio

## Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/gegearsyah/DIMs
    cd DIMs
    cd backend
    ```

2. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

## Data Preparation
1. Before Start Use this application you can use GEE-GetData.js script to get Flood data from Google Earth Engine, The output will be GeoTiff
2. Process the geotiff data using SourceCode_Raster_to_Vector.ipynb to convert the data into vector
3. Transform to data and breakdown the data into polygon. Result of this process will be geoJson
4. This data need to be place into backend, you can place it anywhere but we already provided the polygon data with geoJson format on data folder!

## Data Extraction
1. With the activated virtual envirovment already done, run generate_geojson.py on scripts folder backend
2. This will run command to extract GeoJson data to Mongodb. Make sure the mongoDb can running on your PC

## Run Backend
```bash
  uvicorn main:app --reload
  ```

## Frontend Setup
https://reactnative.dev/docs/set-up-your-environment