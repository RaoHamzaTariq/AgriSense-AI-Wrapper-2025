from agents import Runner
from config.model_config import config
from multi_agents.weather_agent import weather_analyzer_agent
from multi_agents.crop_agent import crop_analysis_agent
from multi_agents.planner_agent import planner_agent
from multi_agents.triage_agent import triage_agent
from schema.models import UserInput
from tools.weather_data import get_weather_data
from schema.models import RunnerContext
from config.memory import MemoryStore


class AgriSenseAgentRunner:
    
    async def build_message_history(self, rows):
        messages = []
        for user_id, role, message, created_at in rows:
            msg_role = "assistant" if role == "ai" else role
            messages.append({"role": msg_role, "content": message})
        return messages

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

        Location: {user_input.location}
        season: {user_input.season}
        Soil Type: {user_input.soil_type}
        Farming Duration: {user_input.duration} months

        Current Weather Data:
        - Temperature: {weather_data.get('temperature_C', 'N/A')}°C
        - Feels Like: {weather_data.get('feels_like_C', 'N/A')}°C
        - Humidity: {weather_data.get('humidity', 'N/A')}%
        - Pressure: {weather_data.get('pressure', 'N/A')} hPa
        - Weather Condition: {weather_data.get('weather_main', 'N/A')} ({weather_data.get('weather_description', 'N/A')})
        - Wind Speed: {weather_data.get('wind_speed_mps', 'N/A')} m/s
        - Cloudiness: {weather_data.get('cloudiness_percent', 'N/A')}%
        - Rainfall (mm): {weather_data.get('rainfall_mm', 'N/A')}

        Return STRICT JSON matching the WeatherSummary schema with EXACT keys and units as follows.
        Use only numbers for temperatures (no unit symbols). Keys:
        {{
          "location": "{user_input.location}",
          "avg_temperature": <float>,
          "humidity": <float>,
          "rainfall_mm": <float>,
          "climate_type": <string>,
          "forecast_summary": <string>,
          "risk_alerts": [<string>],
          "opportunities": [<string>]
        }}
        Do not include extra keys. Do not wrap in markdown. Output JSON only.
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

    async def AgriChat(self, user_id: str, query: str):
        # Save user's new message
        MemoryStore.save_message(user_id=user_id, role="user", message=query)

        # Fetch history from DB
        rows = MemoryStore.get_history(user_id=user_id, limit=50)
        history_messages = await self.build_message_history(rows)

        # Add the new user message to the list as well
        history_messages.append({"role": "user", "content": query})

        # Now pass this history as part of the agent input
        result = await Runner.run(
            starting_agent=triage_agent,
            input=history_messages,
            run_config=config,
            context=RunnerContext(isPlanner=False, message_history=history_messages)
            # Note: I added a hypothetical parameter `message_history`; adjust based on your agent API
        )
        agent_output = result.final_output

        # Save the agent’s response
        MemoryStore.save_message(user_id=user_id, role="ai", message=agent_output)

        return agent_output

