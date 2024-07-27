from fastapi import APIRouter
from model.polygons import PolygonFeatureCollection
from fastapi import Query, HTTPException
from database.initialize import collection


polygons_router = APIRouter(prefix='/polygons')

@polygons_router.get("/", response_model=PolygonFeatureCollection)
def get_polygons(lat: float = Query(..., description="Latitude of the center point"),
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

