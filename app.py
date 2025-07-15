from flask import Flask, request, render_template, jsonify
import os
import openai

app = Flask(__name__)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY: print("Where is the OpenAI API key? Don't tell me you forgot it.")

def generate_response(user_input:str) -> str:
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return f"Error generating response: {str(e)}"

@app.route("/", methods=["GET"])
def home(): return render_template("index.html")

if __name__ == "__main__": app.run(debug=True)
 