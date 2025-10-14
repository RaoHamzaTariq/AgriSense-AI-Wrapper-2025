import requests, os
from dotenv import load_dotenv
from rich import print

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather(city: str):
    
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    data = requests.get(weather_url).json()
    return data

