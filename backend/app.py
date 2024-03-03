from flask import Flask, render_template, request, jsonify
from src.get_movie_stdname import *

# Usage:
api_key = "2fd0e516159e7ab5247e990f32af6193"
language = "en-US"

# print(get_combined_title("v 字仇杀队", language, api_key))
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result', methods=['POST'])
def result():
    input_text = request.json['input_text']
    processed_result = get_combined_title(input_text, language, api_key)
    return jsonify({'result': processed_result})

if __name__ == "__main__":
    app.run(debug=True, host="10.9.65.32", port=5001)
