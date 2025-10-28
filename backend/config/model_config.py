from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel,RunConfig,set_default_openai_client,set_tracing_disabled
import os
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
base_url = os.getenv("GOOGLE_GEMINI_BASE_URL")

external_client = AsyncOpenAI(
    api_key=api_key,
    base_url=base_url,
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash",
    openai_client=external_client
)

config = RunConfig(
    model=model,
    model_provider=external_client,
    tracing_disabled=True
)
