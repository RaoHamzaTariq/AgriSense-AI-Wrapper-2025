from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel,RunConfig,set_default_openai_client,set_tracing_disabled
import os
from dotenv import load_dotenv
load_dotenv()

GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")
GOOGLE_API_BASE_URL=os.getenv("GOOGLE_API_BASE_URL")

external_client = AsyncOpenAI(
    api_key=GOOGLE_API_KEY,
    base_url=GOOGLE_API_BASE_URL,
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