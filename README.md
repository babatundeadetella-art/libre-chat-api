# LibreChat API

A production-ready starter API for a LibreChat ecosystem with:

- user authentication and JWT sessions
- chat message endpoints
- external API integrations
- web fetch and search endpoints
- AI orchestration endpoint for internet tasks
- modular, extendable Express + TypeScript setup

## Features

- Universal API client wrapper for third-party services
- Structured integration registry for social, news, weather, and search APIs
- Chat persistence in memory with room to add Postgres/SQLite/Prisma later
- Search engine access using DuckDuckGo Instant Answer API
- Fetch webpage data and summarize titles/snippets
- AI planning endpoint for orchestrating multi-step actions

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Start the server in development mode:

```bash
npm run dev
```

4. Or build and run:

```bash
npm run build
npm start
```

## Default admin user

- Email: `admin@librechat.local`
- Password: `admin123`

## API summary

### Auth

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Chat

- `GET /api/v1/chat/messages`
- `POST /api/v1/chat/messages`

### Integrations

- `GET /api/v1/integrations`
- `POST /api/v1/integrations`
- `DELETE /api/v1/integrations/:id`
- `POST /api/v1/integrations/:id/test`

### Web

- `GET /api/v1/web/fetch?url=https://example.com`
- `GET /api/v1/web/search?q=weather+lagos`

### AI orchestration

- `POST /api/v1/ai/orchestrate`

Example payload:

```json
{
  "task": "Research recent AI trends",
  "goal": "Find the latest info",
  "url": "https://example.com",
  "provider": "duckduckgo"
}
```

## Example curl request

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@librechat.local","password":"admin123"}'
```

## Notes

This is intentionally designed as a strong starter implementation. The in-memory store is perfect for demos and rapid iteration, and the code structure is ready for a database-backed version using Prisma or Postgres when you are ready to scale.
