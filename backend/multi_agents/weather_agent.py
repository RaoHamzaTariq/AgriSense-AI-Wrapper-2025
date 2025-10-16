from agents import Agent
from config.model_config import model
from schema.agent_outputs import WeatherSummary

weather_analyzer_agent = Agent(
    name="Weather Agent",
    instructions="""
    You are WeatherAgent — an AI that analyzes weather and climate conditions for agriculture. 
    You receive structured weather data from OpenWeather API including temperature, humidity, rainfall, wind speed, and forecast.
    Your task:
    1. Analyze current, forecasted, and historical patterns.
    2. Identify the general climate type (dry, humid, moderate, cold, etc.).
    3. Summarize upcoming weather trends like rain, drought, storms.
    4. Provide short-term risks or opportunities for farmers.

    Return your response in a structured JSON format.

    """,
    output_type=WeatherSummary
)

