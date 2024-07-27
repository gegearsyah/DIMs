from fastapi import APIRouter
from model.markers import MarkerSummary,MarkerFeature,MarkerFeatureCollection
from fastapi import Query, HTTPException,Body
from pymongo import GEOSPHERE
from database.initialize import db
from typing import List, Union, Annotated

collection = db['marker_collection']

# Ensure the collection has a 2dsphere index
collection.create_index([("geometry", GEOSPHERE)])


markers_router = APIRouter(prefix='/markers')



@markers_router.post("/create")
async def post_markers(data: Annotated[MarkerFeature,Body(
            openapi_examples = {
                "example1": {
                    "summary": "Example for flood Marker type",
                    "description": "A sample body if you wanted to add flood marker",
                    "value": {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-73.9654, 40.7829]
                        },
                        "properties": {
                            "markerType": "flood",
                            "attribute" : {
                            "waterOn": 1,
                            "electricOn": 0,
                            "isSanitation":0,
                            "imageUrl": "link",
                            "Description":"this is flood"}
                        }
                    }
                },
                "example2": {
                    "summary": "Example for medicine Marker type",
                    "description": "A sample body if you wanted to add medicine marker",
                    "value": {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-73.9654, 40.7829]
                        },
                        "properties": {
                            "markerType": "medicine",
                            "attribute" : {
                            "pack": 1,
                            "medicineName": 0,
                            "imageUrl": "link",
                            "Description":"This is drug"
                            }
                        }
                    }
                },
                "example3": {
                    "summary": "Example for food Marker type",
                    "description": "A sample body if you wanted to add food marker",
                    "value": {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-73.9654, 40.7829]
                        },
                        "properties": {
                            "markerType": "food",
                            "attribute" : {
                            "package": 1,
                            "imageUrl": "link",
                            "Description":"this is food"}
                        }
                    }
                },
                "example4": {
                    "summary": "Example for safe house Marker type",
                    "description": "A sample body if you wanted to add safe house marker",
                    "value": {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-73.9654, 40.7829]
                        },
                        "properties": {
                            "markerType": "safe_house",
                            "attribute" : {
                            "spaceAvailable": 1,
                            "imageUrl": "link",
                            "Description":"this is food"}
                        }
                    }
                }
            }
        )
    ]
):
    try:
        if isinstance(data, list):
            data_to_insert = [item.model_dump() for item in data]
            result = collection.insert_many(data_to_insert)
            return data
        else:
            data_to_insert = data.model_dump()
            result = collection.insert_one(data_to_insert)
            return  data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@markers_router.get("/", response_model=MarkerFeatureCollection)
def get_markers(lat: float = Query(..., description="Latitude of the center point"),
                 lon: float = Query(..., description="Longitude of the center point"),
                 radius: float = Query(..., description="Radius in meters")):
    try:
        # Convert radius from meters to radians for geospatial queries
        radius_in_radians = radius / 6378137.0

        # Create a point for the center of the circular area
        center_point = {
            "type": "Point",
            "coordinates": [lon, lat]
        }

        # Query MongoDB for polygons that are within the circular area
        query = {
            "geometry": {
                "$geoWithin": {
                    "$centerSphere": [[lon, lat], radius_in_radians]
                }
            }
        }
        results = list(collection.find(query))

        # Convert MongoDB results to GeoJSON format
        features = []
        for result in results:
            result['_id'] = str(result['_id'])
            features.append({
                "type": "Feature",
                "geometry": result['geometry'],
                "properties": result.get('properties', {})
            })

        geojson = {
            "type": "FeatureCollection",
            "features": features
        }

        return geojson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@markers_router.get("/summary", response_model=MarkerSummary)
def get_markers_summary(lat: float = Query(..., description="Latitude of the center point"),
                 lon: float = Query(..., description="Longitude of the center point"),
                 radius: float = Query(..., description="Radius in meters"),
                 markerType: str = Query(..., description="Marker type")
                 ):
    try:
        # Convert radius from meters to radians for geospatial queries
        radius_in_radians = radius / 6378137.0

        # Create a point for the center of the circular area
        center_point = {
            "type": "Point",
            "coordinates": [lon, lat]
        }

        # Query MongoDB for markers that are within the circular area

        query = {
            "$and": [
                {"properties.markerType": markerType},
                { "geometry": {
                    "$geoWithin": {
                        "$centerSphere": [[lon, lat], radius_in_radians]
                    }
                }}
            ]
        }

        results = list(collection.find(query))

        

        # Convert MongoDB results to GeoJSON format
        features = []

        electricity = 0
        TotalElectricity = 0
        water = 0
        TotalWater = 0
        sanitation = 0
        TotalSanitation = 0

        for result in results:
            
            result['_id'] = str(result['_id'])
            features.append({
                "id" : result['_id'],
                "properties": result['properties']['attribute']
            }
            )

            if result['properties']['attribute']['waterOn'] == 1:
                water = water + 1
                TotalWater = TotalWater + 1
            else:
                TotalWater = TotalWater + 1
            if result['properties']['attribute']['electricOn'] == 1:
                electricity = electricity + 1
                TotalElectricity = TotalElectricity + 1
            else:
                TotalElectricity = TotalElectricity + 1
            if result['properties']['attribute']['isSanitation'] == 1:
                sanitation = sanitation + 1
                TotalSanitation = TotalSanitation + 1
            else:
                TotalSanitation = TotalSanitation + 1

        waterOn = False
        electricOn = False
        isSanitation = False

        if (TotalWater-water < water):
            waterOn = True
        else:
            waterOn = False

        if (TotalElectricity-electricity < electricity):
            electricOn = True
        else:
            electricOn = False

        if (TotalSanitation-sanitation < sanitation):
            isSanitation = True
        else:
            isSanitation = False

        geojson = {
            "type": "FeatureCollection",
            "markerType": markerType,
            "attributes": {
                "waterOn":waterOn ,
                "electricOn":electricOn ,
                "isSanitation":isSanitation
            },
            "data": features
        }

        return geojson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
