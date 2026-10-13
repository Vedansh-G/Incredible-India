import os
import faiss
import pickle

from groq import Groq
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from weather import get_weather
from dynamic_data import *

load_dotenv()

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)

"""
model = genai.GenerativeModel(
    "gemini-2.0-flash"
)
"""

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

index = faiss.read_index(
    "vector_store/tourist.index"
)

with open(
    "vector_store/docs.pkl",
    "rb"
) as f:

    documents = pickle.load(f)

def ask_ai(question,tourist_id=None):

    question_lower = question.lower()

    selected_place_context = ""
    place_name = None
    if tourist_id:

        row = get_tourist_by_id(
            tourist_id
        )

        if row:
            place_name = get_place_city(
                tourist_id
            )
            selected_place_context = f"""
                Current Tourist Place:

                Name : {row[0]}
                Description : {row[1]}
                Timings : {row[2]}
                Best Season : {row[3]}
                Additional Information :
                {row[4]}
                """
    # WEATHER API
    if "weather" in question_lower:

        if place_name:

            weather = get_weather(
                place_name
            )

            if weather:

                return (
                    f"Current weather in "
                    f"{weather['place']}:\n"
                    f"Temperature: "
                    f"{weather['temperature']}°C\n"
                    f"Condition: "
                    f"{weather['weather']}\n"
                    f"Humidity: "
                    f"{weather['humidity']}%"
                )

        for place in [
            "agra",
            "mumbai",
            "kedarnath",
            "varanasi",
            "amritsar",
            "jaipur",
            "mysore"
        ]:

            if place in question_lower:

                weather = get_weather(place)

                if weather:

                    return (
                        f"Current weather in "
                        f"{weather['place']}:\n"
                        f"Temperature: "
                        f"{weather['temperature']}°C\n"
                        f"Condition: "
                        f"{weather['weather']}\n"
                        f"Humidity: "
                        f"{weather['humidity']}%"
                    )

    # TOTAL BOOKINGS
    if "total bookings" in question_lower:

        count = get_booking_count()

        return (
            f"Currently there are "
            f"{count} bookings."
        )

    # SLOTS LEFT
    if "slots" in question_lower:

        for place in [
            "taj mahal",
            "kedarnath",
            "gateway of india",
            "golden temple",
            "varanasi"
        ]:

            if place in question_lower:

                data = slots_left(place)

                if data:

                    return (
                        f"{data['remaining']} slots "
                        f"are available at "
                        f"{data['name']} "
                        f"out of "
                        f"{data['capacity']}."
                    )

    # RAG PART
    search_query = question

    if selected_place_context:

        search_query = (
            selected_place_context
            + "\n"
            + question
        )
    question_embedding = embedding_model.encode(
        [search_query]
    )

    D, I = index.search(
        question_embedding,
        3
    )

    context = ""

    for idx in I[0]:

        context += (
            documents[idx]
            + "\n"
        )

    prompt = f"""
    You are a tourism assistant.

    Use ONLY the information provided.

    Do NOT make assumptions.

    If the answer is not present,
    reply:

    "I do not have enough information."
    Current Page Context:

    {selected_place_context}

    Retrieved Context:

    {context}

    Question:

    {question}

    Answer only using the given information.


If information is not present,
politely say that you do not know.
"""

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "system",
                "content":
                "You are a helpful tourism assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return (
        response
        .choices[0]
        .message.content
    )