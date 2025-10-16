from pydantic import BaseModel
from typing import List, Optional

class WeatherSummary(BaseModel):
    location: str
    avg_temperature: float
    humidity: float
    rainfall_mm: float
    climate_type: str  # e.g., "moderate", "humid", "dry"
    forecast_summary: str
    risk_alerts: Optional[List[str]] = []
    opportunities: Optional[List[str]] = []


class CropRecommendation(BaseModel):
    location: str
    suggested_crops: List[str]
    unsuitable_crops: List[str]
    reasoning: str
    water_requirement_level: str  # e.g., "low", "medium", "high"
    expected_yield_potential: str  # e.g., "high", "moderate", "low"


class FarmingPlan(BaseModel):
    location: str
    primary_crop: str
    soil_preparation_steps: List[str]
    sowing_schedule: str
    irrigation_guidelines: List[str]
    fertilizer_recommendations: List[str]
    harvest_time: str
    storage_advice: List[str]
    risk_precautions: List[str]
    overall_summary: str



