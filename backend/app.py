from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import json
import jwt
import datetime
import os
from functools import wraps

app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": "*",
    "allow_headers": ["Content-Type", "Authorization"],
    "methods": ["GET", "POST", "PUT", "OPTIONS"],
}})

JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-in-prod")
JWT_EXPIRY_HOURS = 24


def get_db():
    conn = sqlite3.connect("db.sqlite3")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
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
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS resumes (
            user_id INTEGER PRIMARY KEY,
            data TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


init_db()


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        print(f"[auth] Authorization header: '{auth_header[:40]}'")
        if not auth_header.startswith("Bearer "):
            print("[auth] Missing or malformed Authorization header")
            return jsonify({"error": "Missing or malformed Authorization header"}), 401
        token = auth_header[7:]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = payload
        except jwt.ExpiredSignatureError:
            print("[auth] Token expired")
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError as e:
            print(f"[auth] Invalid token: {e}")
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated


@app.route("/auth/register", methods=["POST"])
def register():
    body = request.json or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", [email]).fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "Email already registered"}), 409

    password_hash = generate_password_hash(password)
    conn.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", [email, password_hash])
    conn.commit()

    user_row = conn.execute("SELECT id, email FROM users WHERE email = ?", [email]).fetchone()
    conn.close()

    token = jwt.encode(
        {"sub": str(user_row["id"]), "email": user_row["email"],
         "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=JWT_EXPIRY_HOURS)},
        JWT_SECRET, algorithm="HS256"
    )
    return jsonify({"token": token, "email": user_row["email"]}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    body = request.json or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db()
    user = conn.execute("SELECT id, email, password_hash FROM users WHERE email = ?", [email]).fetchone()
    conn.close()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode(
        {"sub": str(user["id"]), "email": user["email"],
         "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=JWT_EXPIRY_HOURS)},
        JWT_SECRET, algorithm="HS256"
    )
    return jsonify({"token": token, "email": user["email"]})


@app.route("/jobs", methods=["GET"])
def get_jobs():
    conn = get_db()
    rows = conn.execute("SELECT * FROM jobs ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/jobs", methods=["POST"])
@require_auth
def create_job():
    body = request.json or {}
    conn = get_db()
    conn.execute(
        "INSERT INTO jobs (title, company, type, location, salary, category) VALUES (?, ?, ?, ?, ?, ?)",
        [body["title"], body["company"], body["type"], body.get("location"), body.get("salary"), body["category"]]
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


@app.route("/resume", methods=["GET"])
@require_auth
def get_resume():
    user_id = request.user["sub"]
    conn = get_db()
    row = conn.execute("SELECT data FROM resumes WHERE user_id = ?", [user_id]).fetchone()
    conn.close()
    if not row:
        return jsonify(None)
    return jsonify(json.loads(row["data"]))


@app.route("/resume", methods=["PUT"])
@require_auth
def save_resume():
    user_id = request.user["sub"]
    body = request.json or {}
    conn = get_db()
    conn.execute(
        """INSERT INTO resumes (user_id, data, updated_at)
           VALUES (?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at""",
        [user_id, json.dumps(body)]
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
