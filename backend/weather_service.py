import requests, os
from dotenv import load_dotenv
from rich import print

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")

async def get_weather(city: str):
    
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    data = requests.get(weather_url).json()

    # Extract key information
    important_info = {
        "city": data.get("name"),
        "country": data["sys"].get("country"),
        "coordinates": data.get("coord"),
        "weather_main": data["weather"][0].get("main"),
        "weather_description": data["weather"][0].get("description"),
        "temperature_C": round(data["main"]["temp"] - 273.15, 2),
        "feels_like_C": round(data["main"]["feels_like"] - 273.15, 2),
        "temp_min_C": round(data["main"]["temp_min"] - 273.15, 2),
        "temp_max_C": round(data["main"]["temp_max"] - 273.15, 2),
        "humidity": data["main"].get("humidity"),
        "pressure": data["main"].get("pressure"),
        "wind_speed_mps": data["wind"].get("speed"),
        "wind_direction_deg": data["wind"].get("deg"),
        "cloudiness_percent": data["clouds"].get("all"),
        "visibility_m": data.get("visibility"),
        "sunrise_unix": data["sys"].get("sunrise"),
        "sunset_unix": data["sys"].get("sunset"),
    }

    return important_info

if __name__=="__main__":

    print(get_weather("Karachi"))