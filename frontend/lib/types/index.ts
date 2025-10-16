export interface FarmData {
    location: string;
    soilType: 'sandy' | 'clay' | 'loamy';
    season: 'summer' | 'winter' | 'monsoon';
    duration?: number;
  }
  
  export interface WeatherSummary {
    location: string;
    avg_temperature: number;
    humidity: number;
    rainfall_mm: number;
    climate_type: string;
    forecast_summary: string;
    risk_alerts?: string[];
    opportunities?: string[];
  }
  
  export interface CropRecommendation {
    location: string;
    suggested_crops: string[];
    unsuitable_crops: string[];
    reasoning: string;
    water_requirement_level: string;
    expected_yield_potential: string;
  }
  
  export interface FarmingPlan {
    location: string;
    primary_crop: string;
    soil_preparation_steps: string[];
    sowing_schedule: string;
    irrigation_guidelines: string[];
    fertilizer_recommendations: string[];
    harvest_time: string;
    storage_advice: string[];
    risk_precautions: string[];
    overall_summary: string;
  }
  
  export interface AIResponse {
    weather: WeatherSummary;
    crop: CropRecommendation;
    plan: FarmingPlan;
  }