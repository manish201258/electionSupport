# Election Process Education Assistant

An interactive full-stack application that teaches users how elections work in India through:

- AI-powered chat guidance
- Timeline viewer of election phases
- Step-by-step learning flow
- FAQ support
- Region-aware context

## Architecture

Frontend (Next.js) -> Backend API (Express) -> AI layer (OpenAI-compatible API) + static/Mongo data.

## Project Structure

project/
- frontend/
  - pages/
  - components/
  - styles/
  - utils/
- backend/
  - src/
    - routes/
    - controllers/
    - services/
    - data/
    - config/
  - tests/
- README.md

## Features Implemented (MVP+)

1. Chat Assistant
- Endpoint: POST /api/chat
- Validates user input
- Uses AI API if configured
- Falls back to offline educational responses when AI is unavailable

2. Timeline Viewer
- Endpoint: GET /api/timeline?region=...
- Returns national + selected region events sorted by date

3. Step-by-Step Guide
- Endpoint: GET /api/steps
- Interactive Previous/Next UI on frontend

4. FAQ Section
- Endpoint: GET /api/faq
- Expandable FAQ cards in chat page

5. Region-Based Info
- Region selector in chat and timeline pages
- Basic region-aware backend filtering

6. Basic Security
- API rate limiting (60 requests/minute)
- Stricter chat endpoint limit (20 requests/minute)
- Payload validation for chat endpoint
- Security headers via Helmet
- Optional CORS allowlist using ALLOWED_ORIGINS
- Environment variable configuration

## Setup Instructions

## 1) Backend Setup

cd backend
npm install
copy .env.example .env
npm run dev

Backend runs on http://localhost:5000

## 2) Frontend Setup

cd frontend
npm install
copy .env.example .env.local
npm run dev

Frontend runs on http://localhost:3000

## Deployment Security Checklist

1. Set backend env vars on your hosting provider (do not upload .env files):
- GROQ_API_KEY
- GROQ_BASE_URL
- GROQ_MODEL
- ALLOWED_ORIGINS (comma-separated frontend URLs)

2. Set frontend env vars on your hosting provider:
- NEXT_PUBLIC_API_BASE_URL

3. Rotate any key that was ever pasted in chat, screenshots, or public channels.

4. Keep CORS strict in production by setting ALLOWED_ORIGINS to exact domains only.

5. Re-run security checks before final release:
- npm audit (frontend and backend)
- npm test (backend)
- npm run build (frontend)

## AI Prompt Strategy

System prompt enforces:
- Simple language
- Step-by-step explanations
- India election context
- Neutral educational responses

## MongoDB Usage

This project works without MongoDB using local seed data.
If MONGODB_URI is provided, backend attempts to connect to MongoDB Atlas.

## API Contract Summary

- GET /health
- GET /api/timeline?region=national
- GET /api/faq
- GET /api/steps
- POST /api/chat
  - body: { "message": "How to vote?", "region": "rajasthan" }

## Testing

Backend tests use Jest + Supertest:

cd backend
npm test

Covers health, timeline, and chat validation/response behavior.

## Deployment

Frontend: Vercel
- Set NEXT_PUBLIC_API_BASE_URL to deployed backend URL

Backend: Render or Railway
- Add env vars from backend .env.example

Database: MongoDB Atlas (optional)
- Set MONGODB_URI
# electionSupport
