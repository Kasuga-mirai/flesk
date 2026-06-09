from flask import Flask, render_template, request, redirect
import base64
import io
from PIL import Image

import markov_model

app = Flask(__name__)


@app.route("/")
def index():

    messages = []

    try:

        with open(
            "board.txt",
            "r",
            encoding="utf-8"
        ) as f:

            lines = f.readlines()

            for line in reversed(lines):

                name, text = \
                    line.strip().split("::")

                messages.append({
                    "name": name,
                    "text": text
                })

    except:

        pass

    return render_template(
        "index.html",
        messages=messages
    )


@app.route("/markov")
def markov():
    text = markov_model.generate()
    return text


@app.route("/upload", methods=["POST"])
def upload():

    data = request.json["image"]

    header, encoded = data.split(",", 1)

    image_data = base64.b64decode(encoded)

    image = Image.open(io.BytesIO(image_data))

    image.save("uploaded.png")

    print("画像保存した！")

    return "OK"


@app.route("/cnn")
def cnn_page():
    return render_template("cnn.html")

@app.route("/sugoi")
def kawaii_page():
    return render_template("sugoi.html")

@app.route("/markov_page")
def markov_page():
    return render_template("markov.html")

@app.route("/count")
def count():

    try:
        with open("counter.txt", "r") as f:
            n = int(f.read())

    except:
        n = 0

    n += 1

    with open("counter.txt", "w") as f:
        f.write(str(n))

    return str(n)

@app.route("/get_count")
def get_count():

    try:
        with open("counter.txt", "r") as f:
            n = int(f.read())

    except:
        n = 0

    return str(n)

messages = []

@app.route("/post_message", methods=["POST"])
def post_message():

    name = request.form.get("name")
    text = request.form.get("text")

    if not name:
        name = "ちゃ"

    if text:

        with open("board.txt", "a", encoding="utf-8") as f:

            f.write(f"{name}::{text}\n")

    return redirect("/")












# 🔥 必ず最後！！
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)