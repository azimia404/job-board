# Job Board & Resume Builder

Link for feedback: https://drive.google.com/file/d/1RKleykh_LHnI3tMiEJzwdHIF6z6rL09I/view?usp=sharing

Link for demo: https://drive.google.com/file/d/1dftcbcytb8B61c-DPXxZzFTm7nBDPt9A/view?usp=drive_link

A full-stack web application that combines a job listing board with a resume builder tool. Built with Next.js on the frontend and Python Flask + SQLite on the backend.

## Features

### Job Board
- Browse open job positions with category filtering
- Post new jobs via a modal form
- Filter by category: Engineering, Design, Marketing, Product
- Real-time job count display
- Toast notifications on actions

### Resume Builder
- Fill in personal info, experience, and education
- Live resume preview as you type
- Add and remove multiple experience and education entries
- Download resume as PDF (A4 format)

### Screenshots and Examples
- See at /screenshots

## Tech Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- Feature-Sliced Design (FSD) architecture

**Backend**
- Python 3
- Flask
- SQLite

## Project Structure

```
job-board/
├── src/
│   ├── app/
│   ├── entities/
│   ├── features/
│   └── shared/
├── backend/
│   ├── app.py
│   └── db.sqlite3
├── public/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.7+
- pip

### Frontend Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install flask flask-cors
python app.py
```

Runs at `http://localhost:5000`

> Both servers must be running at the same time.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | Get all job listings |
| POST | `/jobs` | Create a new job listing |

### POST `/jobs` — Request Body

```json
{
  "title": "Frontend Developer",
  "company": "Acme Corp",
  "type": "Full-time",
  "location": "Remote",
  "salary": "$80,000",
  "category": "Engineering"
}
```

## Database

SQLite database is created automatically on first run. Schema:

```sql
CREATE TABLE jobs (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT,
    company   TEXT,
    type      TEXT,
    location  TEXT,
    salary    TEXT,
    category  TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

To reset the database, delete `backend/db.sqlite3` and restart the server.

## Job Types
`Full-time` · `Part-time` · `Contract` · `Internship`

## Job Categories
`Engineering` · `Design` · `Marketing` · `Product`
