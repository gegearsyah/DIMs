from pydantic import BaseModel, Field
from typing import List, Dict, Any

class Point(BaseModel):
    lat: float = Field(..., description="Latitude of the point")
    lon: float = Field(..., description="Longitude of the point")

class MarkerFeature(BaseModel):
    type: str
    geometry: Dict[str, Any] 
    properties: Dict[str, Any] 


class MarkerSummary(BaseModel):
    markerType: str
    attributes: Dict[str, Any]
    data: List[Any]

class MarkerFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[MarkerFeature]

class VoteModel(BaseModel):
    vote: int