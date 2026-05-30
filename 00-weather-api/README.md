# Weather API with Redis Caching

A professional Node.js Weather API built with Express.js, Redis caching, and the Visual Crossing Weather API.

This project demonstrates:

* Working with third-party APIs
* Redis caching
* Environment variables
* Rate limiting
* Modular backend architecture
* Error handling
* Graceful server shutdown

---

# Features

* Fetch weather data by location
* Redis-based caching
* Automatic cache expiration
* Rate limiting protection
* Environment variable support
* Centralized error handling
* Modular Express architecture
* Graceful shutdown handling

---

# Tech Stack

* Node.js
* Express.js
* Redis
* Visual Crossing Weather API
* express-rate-limit
* dotenv

---

# Project URL

* Roadmap Project:
  https://roadmap.sh/projects/weather-api-wrapper-service

* GitHub Repository:
  https://github.com/Ankitsaini406/node-learn/tree/main/00-weather-api

---

# Project Structure

```bash
src/
│
├── config/
│   └── redis.js
│
├── controllers/
│   └── weather.controller.js
│
├── middleware/
│   └── error.middleware.js
│
├── routes/
│   └── weather.route.js
│
├── utils/
│   └── cache.js
│
├── app.js
└── index.js
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Ankitsaini406/weather-api.git
```

Move into the project directory:

```bash
cd weather-api
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

WEATHER_API_KEY=your_visual_crossing_api_key

REDIS_URL=redis://localhost:6379

NODE_ENV=development
```

---

# Redis Setup

Make sure Redis is running locally before starting the server.

Default Redis port:

```bash
6379
```

To verify Redis is running:

```bash
redis-cli ping
```

Expected response:

```bash
PONG
```

---

# Running the Project

Development mode:

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:5000
```

---

# API Endpoint

## Get Weather Data

### Request

```http
GET /api/weather?location=London,UK
```

### Example

```http
GET http://localhost:5000/api/weather?location=Delhi,India
```

---

# API Flow

1. Client requests weather data
2. Server checks Redis cache
3. If cache exists → return cached data
4. If cache misses → fetch from Visual Crossing API
5. Store response in Redis
6. Return fresh weather data

---

# Response Example

```json
{
  "success": true,
  "source": "weather-api",
  "data": {
    "resolvedAddress": "London, UK"
  }
}
```

---

# Cached Response Example

```json
{
  "success": true,
  "source": "redis-cache",
  "data": {}
}
```

---

# Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Success               |
| 400         | Missing location      |
| 404         | Route not found       |
| 429         | Too many requests     |
| 500         | Internal server error |

---

# Rate Limiting

This API uses rate limiting to prevent abuse.

Current limit:

* 5 requests per minute per IP

---

# Redis Caching

Weather responses are cached using Redis.

Cache key format:

```bash
weather:<location>
```

Example:

```bash
weather:london
```

Cached data automatically expires after:

```bash
300 seconds (5 minutes)
```

---

# Graceful Shutdown

The server supports graceful shutdown for:

* SIGINT
* SIGTERM

This ensures proper cleanup before the application exits.

---

# Error Handling

The project includes centralized error handling middleware.

Examples handled:

* Invalid location
* Missing query parameters
* Third-party API failure
* Redis errors
* Unknown routes

---

# Future Improvements

* Swagger API documentation
* Docker support
* Unit testing
* TypeScript migration
* Logging with Winston/Pino
* API versioning
* HTTPS support
* Request validation using Zod/Joi

---

# License

ISC License

---

# Author

Ankit Saini
