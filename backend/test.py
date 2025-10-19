from main import AgriSenseAgentRunner

agri_sense = AgriSenseAgentRunner()

async def main():
    while True:
        query=input("USER INPUT: ")
        if query in ["q","exit","break"]:
            break
        result = await agri_sense.AgriChat(query)
        print(result)

    
if __name__ == "__main__":
    import asyncio

    asyncio.run(main())