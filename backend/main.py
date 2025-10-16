from agents import Runner
from config.model_config import config
from multi_agents.weather_agent import weather_analyzer_agent
from multi_agents.crop_agent import crop_analysis_agent
from multi_agents.planner_agent import planner_agent
from multi_agents.triage_agent import triage_agent
from schema.models import UserInput
from tools.weather_data import get_weather_data
from schema.models import RunnerContext


class AgriSenseAgentRunner:
    
    async def Planner(self, user_input: UserInput):
        """
        Runs the AgriSense multi-agent system:
        - Gathers weather data
        - Performs weather analysis
        - Performs crop suitability analysis
        - Creates a detailed farming plan
        """

        # STEP 1: Get Weather Data
        weather_data = await get_weather_data(user_input.location)
        print(f"Fetched weather data for {user_input.location}: {weather_data}")

        # STEP 2: Weather Analysis Prompt
        weather_prompt = f"""
        You are the **Weather Analyzer Agent**.
        Analyze the latest weather and climate conditions for agricultural planning.

        **Location:** {user_input.location}
        **season:** {user_input.season}
        **Soil Type:** {user_input.soil_type}
        **Farming Duration:** {user_input.duration} months

        **Current Weather Data:**
        - Temperature: {weather_data.get('temperature_C', 'N/A')}°C
        - Feels Like: {weather_data.get('feels_like_C', 'N/A')}°C
        - Humidity: {weather_data.get('humidity', 'N/A')}%
        - Pressure: {weather_data.get('pressure', 'N/A')} hPa
        - Weather Condition: {weather_data.get('weather_main', 'N/A')} ({weather_data.get('weather_description', 'N/A')})
        - Wind Speed: {weather_data.get('wind_speed_mps', 'N/A')} m/s
        - Cloudiness: {weather_data.get('cloudiness_percent', 'N/A')}%
        - Rainfall (mm): {weather_data.get('rainfall_mm', 'N/A')}

        Please summarize:
        - Overall climate type (e.g., humid, dry, moderate)
        - Average temperature and rainfall trend
        - Risks or weather-related warnings
        - Opportunities for farming during this period
        Provide your answer strictly in the structure of a **WeatherSummary** model.
        """

        weather_agent_result = await Runner.run(
            starting_agent=weather_analyzer_agent,
            input=weather_prompt,
            run_config=config,
            context=RunnerContext(isPlanner=True)
        )

        # STEP 3: Crop Suitability Analysis Prompt
        crop_prompt = f"""
        You are the **Crop Analysis Agent**.
        Use the following information to determine the best and least suitable crops.

        **Weather Analysis Summary:**
        {weather_agent_result.final_output}

        **Farming Context:**
        - Location: {user_input.location}
        - Soil Type: {user_input.soil_type}
        - season: {user_input.season}
        - Planned Duration: {user_input.duration} months

        Please identify:
        - Most suitable crops for this weather and soil combination
        - Unsuitable crops and why
        - Water requirement levels
        - Expected yield potential
        Explain your reasoning concisely.

        Provide your response in the structure of a **CropRecommendation** model.
        """

        crop_result = await Runner.run(
            starting_agent=crop_analysis_agent,
            input=crop_prompt,
            run_config=config,
            context=RunnerContext(isPlanner=True)
        )

        # STEP 4: Complete Farming Plan Prompt
        planner_prompt = f"""
        You are the **Farming Planner Agent**.
        Based on both the weather and crop analysis, create a practical, actionable plan.

        **Weather Analysis Outcome:**
        {weather_agent_result.final_output}

        **Crop Analysis Outcome:**
        {crop_result.final_output}

        **Farmer Context:**
        - Location: {user_input.location}
        - Soil Type: {user_input.soil_type}
        - season: {user_input.season}
        - Farming Duration: {user_input.duration} months

        Create a detailed plan including:
        1. The most suitable primary crop to grow
        2. Soil preparation steps
        3. Sowing schedule
        4. Irrigation guidelines based on weather and soil
        5. Fertilizer and nutrient management advice
        6. Harvest timing and storage suggestions
        7. Risk precautions (pests, weather, etc.)
        8. A clear overall summary for the farmer

        Provide your response in the structure of a **FarmingPlan** model.
        """

        planner_result = await Runner.run(
            starting_agent=planner_agent,
            input=planner_prompt,
            run_config=config,
            context=RunnerContext(isPlanner=True)
        )

        # STEP 5: Return structured results
        return {
            "weather_analysis": weather_agent_result.final_output,
            "crop_analysis": crop_result.final_output,
            "planner": planner_result.final_output,
        }

    async def AgriChat(self, query):
        
        result= await Runner.run(
            starting_agent=triage_agent,
            input=query,
            run_config=config,
            context=RunnerContext(isPlanner=False)
        )

        return result.final_output
