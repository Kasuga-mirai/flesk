import sqlite3

conn = sqlite3.connect("counter.db")

c = conn.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS counter (
    id INTEGER PRIMARY KEY,
    count INTEGER
)
""")

# 初期値
c.execute("""
INSERT OR IGNORE INTO counter (id, count)
VALUES (1, 0)
""")

conn.commit()
conn.close()

print("DB作成完了！")