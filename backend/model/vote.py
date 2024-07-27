from pydantic import BaseModel

class voteData(BaseModel):
    markerID: str
    phoneNumber: str
    vote: int