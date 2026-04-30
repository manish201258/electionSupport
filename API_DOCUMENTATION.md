# Election Support API Documentation

## Overview

The Election Support API provides endpoints for election education content, AI-powered chat assistance, and user feedback collection.

**Base URL:** `http://localhost:5000` (development) or deployed backend URL

---

## Authentication & Security

- No authentication required (public API)
- Rate limiting: 60 requests/minute (general), 20 requests/minute (/api/chat)
- CORS enabled for configured origins
- All inputs sanitized to prevent XSS/injection attacks
- HTTPS required in production

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check API health status.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T10:30:00Z"
}
```

---

### 2. Timeline Endpoint

**GET** `/api/timeline?region=national`

Get election phases/timeline for a specific region.

**Query Parameters:**
- `region` (optional): `national`, `rajasthan`, `maharashtra`, `karnataka`

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "phase_1",
      "phase": "Nominations",
      "date": "2026-05-15",
      "description": "Nomination filing begins",
      "region": "national"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Invalid region
  ```json
  {
    "error": {
      "status": 400,
      "message": "Unsupported region. Use one of: national, rajasthan, maharashtra, karnataka"
    }
  }
  ```

**Caching:**
- Response cached for 5 minutes with `Cache-Control: public, max-age=300`

---

### 3. FAQ Endpoint

**GET** `/api/faq`

Get frequently asked questions.

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "faq_1",
      "question": "What is the voting age?",
      "answer": "18 years old",
      "category": "eligibility"
    }
  ]
}
```

**Caching:**
- Response cached for 5 minutes

---

### 4. Steps Endpoint

**GET** `/api/steps`

Get step-by-step voting process guide.

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "step_1",
      "title": "Check your voter status",
      "description": "Visit www.eci.gov.in to verify...",
      "order": 1
    }
  ]
}
```

**Caching:**
- Response cached for 5 minutes

---

### 5. Chat Endpoint

**POST** `/api/chat`

Get AI-powered assistance on election topics.

**Request Body:**
```json
{
  "message": "How do I register to vote?",
  "region": "national"
}
```

**Request Parameters:**
- `message` (required, string, max 500 chars): User question
- `region` (optional, string): `national`, `rajasthan`, `maharathtra`, `karnataka`

**Response:** `200 OK`
```json
{
  "reply": "To register as a voter, you need to...",
  "sources": ["ai"]
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
  ```json
  {
    "error": {
      "status": 400,
      "message": "Validation failed",
      "details": [
        {
          "field": "message",
          "message": "message is required"
        }
      ]
    }
  }
  ```

**Rate Limiting:**
- Limited to 20 requests/minute
- Stricter limit to prevent abuse

---

### 6. Announcements Endpoint

**GET** `/api/announcements`

Get latest verified announcements about elections.

**Response:** `200 OK`
```json
{
  "items": [
    {
      "title": "Voter Registration Deadline",
      "description": "Last date to register...",
      "region": "national",
      "timestamp": "2026-05-01T10:00:00Z"
    }
  ]
}
```

**Source:**
- Primarily from Firestore (if enabled)
- Falls back to seed data if Firestore unavailable

---

### 7. Feedback Endpoint

**POST** `/api/feedback`

Submit user feedback on the app.

**Request Body:**
```json
{
  "page": "chat",
  "region": "national",
  "rating": 5,
  "comment": "Great app!"
}
```

**Request Parameters:**
- `page` (required, string): Page where feedback was given (`home`, `chat`, `timeline`, `guide`)
- `region` (required, string): Region context
- `rating` (required, integer): 1-5 rating
- `comment` (required, string, max 250 chars): Feedback comment

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Feedback received successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid feedback
  ```json
  {
    "error": {
      "status": 400,
      "message": "Validation failed",
      "details": [...]
    }
  }
  ```

**Storage:**
- Submitted to Firestore (if enabled)
- Falls back to backend memory if Firestore unavailable

---

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "error": {
    "status": 400,
    "message": "Description of error",
    "details": {}
  }
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server issue |

---

## Rate Limiting

**General Limit:** 60 requests per minute
**Chat Limit:** 20 requests per minute

When rate limit exceeded:
```json
{
  "error": {
    "status": 429,
    "message": "Too many requests, please try again later"
  }
}
```

---

## Caching Strategy

| Endpoint | Duration | Type |
|----------|----------|------|
| /api/timeline | 5 min | public |
| /api/faq | 5 min | public |
| /api/steps | 5 min | public |
| /api/chat | 1 min | no-cache |
| /api/announcements | dynamic | public |
| /api/feedback | 1 min | no-cache |

---

## Environment Variables

```
# AI Service
GROQ_API_KEY=your_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=mixtral-8x7b-32768

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# MongoDB (optional)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Logging
NODE_ENV=development
```

---

## Examples

### Example 1: Get Timeline for Rajasthan

```bash
curl "http://localhost:5000/api/timeline?region=rajasthan" \
  -H "Accept: application/json"
```

### Example 2: Submit Chat Question

```bash
curl -X POST "http://localhost:5000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What documents do I need to vote?",
    "region": "maharashtra"
  }'
```

### Example 3: Submit Feedback

```bash
curl -X POST "http://localhost:5000/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "page": "guide",
    "region": "national",
    "rating": 5,
    "comment": "Very helpful step-by-step guide!"
  }'
```

---

## Support

For issues or questions, refer to the main [README.md](README.md) or create an issue in the project repository.

**Last Updated:** May 1, 2026  
**Version:** 1.0.0
