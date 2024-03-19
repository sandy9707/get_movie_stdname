from flask import Flask, render_template, request, jsonify
from src.get_movie_stdname import *

# Usage:
api_key = "2fd0e516159e7ab5247e990f32af6193"
language = "en-US"

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/calculate-movie", methods=["POST"])
def calculate_movie():
    input_text = request.form.get("input_text")
    # input_text = "La.La.Land"
    processed_result = get_combined_title(
        input_text, language, api_key
    )  # Use getMovieStdname to calculate movie standard name
    return jsonify({"result": processed_result})


@app.route("/calculate-tv", methods=["POST"])
def calculate_tv():
    input_text = request.form.get("input_text")

    processed_result = get_combined_title_tvs(
        input_text, language, api_key
    )  # Use getTvStdname to calculate TV standard name
    return jsonify({"result": processed_result})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
