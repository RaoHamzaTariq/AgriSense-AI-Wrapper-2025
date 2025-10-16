from pydantic import BaseModel
from typing import Literal

class UserInput(BaseModel):
    location:str
    soil_type: Literal["Loamy", "Sandy", "Clay"]
    season: Literal["Summer", "Winter", "Monsoon"]
    duration: int