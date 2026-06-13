# ReLoop 🔄

> Amazon Hackathon Project — Sustainable Returns & Recommerce Platform

## Project Structure

```
reloop-hackathon/
├── reloop-backend/     # FastAPI + MongoDB + Claude AI
├── reloop-frontend/    # React + Vite + TailwindCSS
└── README.md
```

## Quick Start

### Backend
```bash
cd reloop-backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/api/health
```

### Frontend
```bash
cd reloop-frontend
npm install
npm run dev
# → http://localhost:3000
```

## API Health Check
```
GET /api/health
→ { "status": "ok", "project": "ReLoop" }
```

## Branching Strategy
- `main` — stable only
- `dev/person1` — backend + ML (Person 1)
- `dev/person2` — frontend + UI (Person 2)

Merge order: feature → dev/personX → main (at integration checkpoint)

## Tech Stack
| Layer | Tech |
|-------|------|
| Backend | FastAPI, Uvicorn, Motor (async MongoDB) |
| AI | Anthropic Claude |
| Database | MongoDB |
| Frontend | React 18, Vite, TailwindCSS, Recharts |
| Auth | JWT (via python-jose) |
