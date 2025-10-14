from fastapi import FastAPI
from models import UserInput
from weather_service import get_weather
from agent_service import generate_crop_plan

app = FastAPI()

@app.post("/plan")
async def get_crop_plan(user_input: UserInput):
    weather = await get_weather(user_input.city)
    plan = await generate_crop_plan(user_input.city, weather)
    return {"city": user_input.city, "plan": plan}
