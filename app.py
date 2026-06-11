from flask import Flask, render_template, request, redirect,jsonify
import base64
import io
from PIL import Image
import sqlite3

import pickle
import json

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


with open("model.pkl", "rb") as f:
    model, starts = pickle.load(f)

def generate_sentence(markov, starts, order=2):
    import random

    start = random.choice(starts)
    sentence = list(start)

    while True:
        key = tuple(sentence[-order:])
        if key not in markov:
            break

        next_word = random.choice(markov[key])
        sentence.append(next_word)

        if len(sentence) > 100:
            break

    return "未来「" + "".join(sentence) + "」"

@app.route("/markov")
@app.route("/markov")
def markov():
    return generate_sentence(model, starts)


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

@app.route("/nenpyo")
def kawaii_page():
    return render_template("sugoi.html")

@app.route("/markoving")
def markov_page():
    return render_template("markov.html")

@app.route("/song")
def song_page():
    return render_template("song.html")


@app.route("/count")
def count():

    conn = sqlite3.connect("counter.db")
    c = conn.cursor()

    # 現在値取得
    c.execute(
        "SELECT count FROM counter WHERE id=1"
    )

    n = c.fetchone()[0]

    # +1
    n += 1

    # 更新
    c.execute(
        "UPDATE counter SET count=? WHERE id=1",
        (n,)
    )

    conn.commit()
    conn.close()

    return str(n)

@app.route("/get_count")
def get_count():

    conn = sqlite3.connect("counter.db")
    c = conn.cursor()

    c.execute(
        "SELECT count FROM counter WHERE id=1"
    )

    n = c.fetchone()[0]

    conn.close()

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



import random

def load_songs():

    with open("songlist.json", "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/random_song_api")
def random_song_api():

    songs = load_songs()

    song = random.choice(songs)

    return jsonify(song)








# 🔥 必ず最後！！
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)