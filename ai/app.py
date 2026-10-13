from flask import Flask
from flask import request
from flask import jsonify

from flask_cors import CORS

from chatbot import ask_ai

app = Flask(__name__)

CORS(app)

@app.route(
    "/chat",
    methods=["POST"]
)
def chat():

    data = request.json

    question = data["question"]

    tourist_id = data.get(
        "touristId"
    )
    answer = ask_ai(
        question,tourist_id
    )

    return jsonify({
        "answer":answer
    })


if __name__=="__main__":

    app.run(
        port=8000,
        debug=True
    )