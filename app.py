from flask import Flask, request, render_template, jsonify
import os
import google.generativeai as genai
import PIL.Image

API_KEY = os.getenv("API_KEY")
if not API_KEY: raise ValueError("API_KEY environment variable is not set.")
app = Flask(__name__)
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

def generate_response_text(prompt):
    try:
        response = model.generate_content(f"You are inside a website where you rate how cringe text is. Rate the following text on a scale of 1 to 100%, where 1 is extremely cringe and 100 is not cringe: {prompt}")
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

def generate_response_image(image):
    try:
        response = model.generate_image(image, "Generate an image based on the provided text.")
        return response.image
    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/", methods=["GET"])
def home(): return render_template("index.html")

if __name__ == "__main__": app.run(debug=True)
