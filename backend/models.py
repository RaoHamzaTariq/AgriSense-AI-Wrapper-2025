from pydantic import BaseModel

class UserInput(BaseModel):
    city: str

class CropPlan(BaseModel):
    crop: str
    reasoning: str
    steps: list[str]

example="""
{
  "coord": {
    "lon": -74.006,
    "lat": 40.7143
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 287.47,
    "feels_like": 287.1,
    "temp_min": 286.57,
    "temp_max": 288.69,
    "pressure": 1017,
    "humidity": 82,
    "sea_level": 1017,
    "grnd_level": 1016
  },
  "visibility": 10000,
  "wind": {
    "speed": 5.81,
    "deg": 352,
    "gust": 8.49
  },
  "clouds": {
    "all": 100
  },
  "dt": 1760457487,
  "sys": {
    "type": 1,
    "id": 4610,
    "country": "US",
    "sunrise": 1760439968,
    "sunset": 1760480248
  },
  "timezone": -14400,
  "id": 5128581,
  "name": "New York",
  "cod": 200
}
"""
