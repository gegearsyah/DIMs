from fastapi import APIRouter
from model.markers import MarkerSummary,MarkerFeature,MarkerFeatureCollection,VoteModel
from fastapi import Query, HTTPException,Body
from pymongo import GEOSPHERE
from firebase.initialize import messaging
from database.initialize import db
from typing import Annotated, Dict, Any
from bson import ObjectId

collection = db['marker_collection']
UserCollection = db['users']

# Ensure the collection has a 2dsphere index
collection.create_index([("geometry", GEOSPHERE)])

VoteCollection = db['vote_collection'] 

markers_router = APIRouter(prefix='/markers')

@markers_router.get("/{markerID}", response_model=MarkerFeature)
async def get_single_marker(markerID: str):

    
    result = collection.find_one({"_id": ObjectId(markerID)}, {})
    
    if result is None:
        raise HTTPException(status_code=404, detail="Marker not found")
    
    return result

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
                            "phone_number": "08918",
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
                            "phone_number": "08918",
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
                            "phone_number": "08918",
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
                            "phone_number": "08918",
                            "spaceAvailable": 1,
                            "imageUrl": "link",
                            "Description":"this is food"}
                        }
                    }
                },
                "example5": {
                    "summary": "Example for emergency Marker type",
                    "description": "A sample body if you wanted to add emergency marker",
                    "value": {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-73.9654, 40.7829]
                        },
                        "properties": {
                            "markerType": "emergency",
                            "attribute" : {
                            "phone_number": "08918"
                            }
                            
                        }
                    }
                }
            }
        )
    ]
):
    try:
        data_to_insert = data.model_dump()
        result = collection.insert_one(data_to_insert)
        print(data_to_insert['properties']['markerType'])

        user_data = UserCollection.find_one({"phone_number": data_to_insert['properties']['attribute']['phone_number']}, {})

        if user_data is None:
            raise HTTPException(status_code=404, detail="User not found")
        
      
        if data_to_insert['properties']['markerType'] == 'emergency':
            # Create a message to send to the device
            message = messaging.Message(
                notification=messaging.Notification(
                    title="Emergency!",
                    body="USER WITH PHONE NUMBER" + user_data.get('phone_number') + " NEED YOUR IMMEDIATE ACTION"
                ),
                token="",
            )

            # Send the message
            response = messaging.send(message)

        return {
            "id" : str(result.inserted_id),
            "status":"ok"
            }
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
    

def get_current_vote(markerID: str,phoneNumber:str) -> int:
    """Retrieve the current vote count for the given item ID."""
    try:
        object_id = ObjectId(markerID)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid item ID: {e}")

    document = collection.find_one({"_id": object_id}, {"properties.vote": 1})

    if not document:
        raise HTTPException(status_code=404, detail="Marker not found")

    # Return the current vote count, default to 0 if not set
    return document.get("properties", {}).get("vote", 0)

@markers_router.patch("/updateVote/{markerID}", response_model=Dict[str, Any])
async def update_vote(markerID: str, vote_data: VoteModel = Body(...)):
    # Retrieve the current vote
    if vote_data.vote > 1 or vote_data.vote < -1:
        raise HTTPException(status_code=404, detail="Vote is not valid")
    elif vote_data.vote == 0:
        raise HTTPException(status_code=404, detail="Vote is not valid")
    

    previous_vote = get_current_vote(markerID,VoteModel.phone_number) 
    current_vote = previous_vote + vote_data.vote

    document = collection.find_one({"_id": ObjectId(markerID)}, {"properties.vote": 1})



    # Construct the update data
    update_data = {
        "properties.vote": current_vote 
    }

    # Update the document in the collection
    result = collection.update_one(
        {"_id": ObjectId(markerID)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Marker not found")

    # Return the previous and updated vote values
    return {
        "message": "Vote updated successfully",
        "previous_vote": previous_vote,
        "updated_vote": current_vote
    }

