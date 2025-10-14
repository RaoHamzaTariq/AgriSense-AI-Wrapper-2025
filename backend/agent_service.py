import os
from openai import OpenAI
from dotenv import load_dotenv
from agents import Agent, Runner

from models import CropPlan
from config import config,model

async def generate_crop_plan(city, weather_data):
   
    # Build a detailed and clear prompt
    prompt = f"""
    You are an expert agricultural consultant specializing in climate-based crop recommendations.

    Below is the 

    ### Task:
    Based on the weather data, recommend the **most suitable crop** to plant in given city **right now**.

    Please include:
    1. 🌾 The best crop(s) for current conditions.  
    2. 🌦️ A short explanation (why those crops fit this weather).  
    3. 🧑‍🌾 Three clear and simple **steps to prepare** the soil or area for planting.

    Use a friendly, helpful tone. Keep it concise but informative.
    """

    agent = Agent(
        name="Weather Agent",
        instructions=prompt,
        output_type=CropPlan,
        model=model
    )
    # Return the model's response text safely
    
    result = await Runner.run(
        starting_agent=agent,
        input=f"""
            latest weather information for {city}:
            - **Temperature:** {weather_data.get('temperature_C', 'N/A')}°C  
            - **Feels Like:** {weather_data.get('feels_like_C', 'N/A')}°C  
            - **Humidity:** {weather_data.get('humidity', 'N/A')}%  
            - **Pressure:** {weather_data.get('pressure', 'N/A')} hPa  
            - **Weather Condition:** {weather_data.get('weather_main', 'N/A')} ({weather_data.get('weather_description', 'N/A')})  
            - **Wind Speed:** {weather_data.get('wind_speed_mps', 'N/A')} m/s  
            - **Cloudiness:** {weather_data.get('cloudiness_percent', 'N/A')}%
        """,
        run_config=config
    )
    return result.final_output