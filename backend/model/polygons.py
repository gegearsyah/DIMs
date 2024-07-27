from pydantic import BaseModel, Field
from typing import List, Dict, Any

class Point(BaseModel):
    lat: float = Field(..., description="Latitude of the point")
    lon: float = Field(..., description="Longitude of the point")

class PolygonFeature(BaseModel):
    type: str
    geometry: Dict[str, Any]
    properties: Dict[str, Any] = None

class PolygonFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[PolygonFeature]