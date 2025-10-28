from main import AgriSenseAgentRunner
from schema.models import UserInput
agri_sense = AgriSenseAgentRunner()
async def main():
    while True:
        query=input("USER INPUT: ")
        if query in ["q","exit","break"]:
            break
        result = await agri_sense.AgriChat("user_123",query)
        print(result)


async def test_agri_plan():
    user_input= UserInput(
        location="Karachi",
        soil_type="Sandy",
        season="Winter",
        duration=5
    )
    result = await agri_sense.Planner(user_input)
    print(result)

    
if __name__ == "__main__":
    import asyncio

    asyncio.run(test_agri_plan())