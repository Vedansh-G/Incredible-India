import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")

def get_weather(place):

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={place}&appid={API_KEY}&units=metric"
    )

    response = requests.get(url)

    data = response.json()

    if data.get("cod") != 200:
        return None

    return {
        "place": data["name"],
        "temperature": data["main"]["temp"],
        "weather": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"]
    }