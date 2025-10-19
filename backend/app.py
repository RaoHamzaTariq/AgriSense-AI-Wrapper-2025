from typing import Literal, Union
from fastapi import FastAPI
from pydantic import BaseModel
from main import AgriSenseAgentRunner
from schema.models import UserInput
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

AgriSense = AgriSenseAgentRunner()

@app.post("/plan")
async def get_crop_plan(user_input: UserInput):
    print(user_input)
    results = await AgriSense.Planner(user_input)
    return {"location": user_input.location, "plan": results["planner"], "crop_analysis":results["crop_analysis"], "weather_analysis":results["weather_analysis"]}

@app.get("/chat")
async def chatbot(query: str):
    print(query)
    result = await AgriSense.AgriChat(query)
    print(result)
    return {"message": str(result)}
