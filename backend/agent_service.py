import os
from openai import OpenAI
from dotenv import load_dotenv
from agents import Agent, Runner

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_crop_plan(city, weather_data, client):
   
    # Build a detailed and clear prompt
    prompt = f"""
You are an expert agricultural consultant specializing in climate-based crop recommendations.

Below is the latest weather information for {city}:
- **Temperature:** {weather_data.get('temperature_C', 'N/A')}°C  
- **Feels Like:** {weather_data.get('feels_like_C', 'N/A')}°C  
- **Humidity:** {weather_data.get('humidity', 'N/A')}%  
- **Pressure:** {weather_data.get('pressure', 'N/A')} hPa  
- **Weather Condition:** {weather_data.get('weather_main', 'N/A')} ({weather_data.get('weather_description', 'N/A')})  
- **Wind Speed:** {weather_data.get('wind_speed_mps', 'N/A')} m/s  
- **Cloudiness:** {weather_data.get('cloudiness_percent', 'N/A')}%

### Task:
Based on this weather data, recommend the **most suitable crop** to plant in {city} **right now**.

Please include:
1. 🌾 The best crop(s) for current conditions.  
2. 🌦️ A short explanation (why those crops fit this weather).  
3. 🧑‍🌾 Three clear and simple **steps to prepare** the soil or area for planting.

Use a friendly, helpful tone. Keep it concise but informative.
"""

    # Send structured request to OpenAI
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an agricultural expert providing practical, climate-based crop recommendations."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7  # moderate creativity
    )

    # Return the model's response text safely
    return response.choices[0].message.content.strip()
