import requests, os
from dotenv import load_dotenv
from rich import print
from agents import function_tool,RunContextWrapper,Agent

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")

def isToolAllowed(ctx:RunContextWrapper, agent:Agent):
    if ctx.context.isPlanner:
        return False
    else:
        return True

from typing import Any

from pydantic import BaseModel

from agents import RunContextWrapper, FunctionTool



async def get_weather_data(city: str):
    """
    This is used to fetch the weather data
    Args:
        city : str
    Returns
        Weather Data including temperture, pressure,windspeed or much more
    """
    if not API_KEY:
        raise RuntimeError("Missing OPENWEATHER_API_KEY environment variable")

    weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city.capitalize()}&appid={API_KEY}"
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
    print(important_info)

    return important_info



class FunctionArgs(BaseModel):
    city:str


async def run_function(ctx: RunContextWrapper[Any], args: str) -> str:
    parsed = FunctionArgs.model_validate_json(args)
    return get_weather_data(city=parsed.city)


get_weather_data_tool = FunctionTool(
    name="get_weather_data",
    description="""
    This is used to fetch the weather data
    Args:
        city : str
    Returns
        Weather Data including temperture, pressure,windspeed or much more
    """,
    params_json_schema=FunctionArgs.model_json_schema(),
    on_invoke_tool=run_function,
    is_enabled=isToolAllowed
)