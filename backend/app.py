from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect("db.sqlite3")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            company TEXT,
            type TEXT,
            location TEXT,
            salary TEXT,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/jobs", methods=["GET"])
def get_jobs():
    conn = sqlite3.connect("db.sqlite3")
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM jobs ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/jobs", methods=["POST"])
def create_job():
    body = request.json
    conn = sqlite3.connect("db.sqlite3")
    conn.execute(
        "INSERT INTO jobs (title, company, type, location, salary, category) VALUES (?, ?, ?, ?, ?, ?)",
        [body["title"], body["company"], body["type"], body.get("location"), body.get("salary"), body["category"]]
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True, port=5000)