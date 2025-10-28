from typing import Literal, Union
from fastapi import FastAPI, HTTPException
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

# Welcome Route for testing
@app.get("/")
async def get_root():
    return {"message":"Welcome to AgriSense"}

@app.post("/plan")
async def get_crop_plan(user_input: UserInput):
    try:
        results = await AgriSense.Planner(user_input)
        return {"location": user_input.location, "plan": results["planner"], "crop_analysis":results["crop_analysis"], "weather_analysis":results["weather_analysis"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": "PlannerFailed", "message": str(e)})

@app.get("/chat")
async def chatbot(query: str, user_id:str):
    try:
        result = await AgriSense.AgriChat(user_id=user_id, query=query)
        return {"message": str(result)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": "ChatFailed", "message": str(e)})
