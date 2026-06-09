import pickle
import re
from collections import defaultdict
from janome.tokenizer import Tokenizer

# ===== 元データ読み込み =====
with open("learntext.txt", encoding="utf-8") as f:
    new_text = f.read()

# ===== テキスト分割 =====
new_text = new_text.replace("\n", " ")
sentences = re.split("[。！？]", new_text)

texts = []
for s in sentences:
    s = s.strip()
    if s:
        texts.append(s)

# ===== Markov構築 =====
def build_markov_model(text_list, order):
    tokenizer = Tokenizer()
    markov = defaultdict(list)
    starts = []

    for text in text_list:
        tokens = [t.surface for t in tokenizer.tokenize(text)]

        if len(tokens) >= order:
            starts.append(tuple(tokens[:order]))

        for i in range(len(tokens) - order):
            key = tuple(tokens[i:i+order])
            next_word = tokens[i+order]
            markov[key].append(next_word)

    return markov, starts

# ===== 学習実行 =====
model, starts = build_markov_model(texts, order=2)

# ===== 保存 =====
with open("model.pkl", "wb") as f:
    pickle.dump((model, starts), f)

print("model.pkl 作成完了🔥")