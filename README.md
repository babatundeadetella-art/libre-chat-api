# LibreChat API

A feature-rich, universal API starter for LibreChat and internet-powered workflows. It provides:

- Universal third-party API client integration
- Chat/message backend with auth
- Web fetch and search APIs
- AI provider orchestration for major model vendors
- User management and extensible service layer
- Ready structure for production scaling

## Included AI providers

This starter supports the most common AI model families:

- OpenAI: GPT-4o, GPT-4o Mini, GPT-4.1 Mini, o3-mini
- Anthropic: Claude 3.5/3.7/Opus
- Google Gemini: Gemini 1.5 Flash/Pro, Gemini 2.0 Flash
- DeepSeek: DeepSeek Chat and Reasoner
- Groq: Llama, Mixtral, Gemma
- Mistral: Large, Codestral, Nemo
- OpenRouter: Multi-provider routing hub across major LLMs

## Features

- JWT-based auth and user sessions
- Chat message creation and retrieval
- External API registry and health checks
- Web fetching and search integration
- AI model provider discovery and runtime chat provider abstraction
- In-memory demo persistence for fast iteration

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Add your API keys if you want live AI calls.

4. Start the app:

```bash
npm run dev
```

## Default admin user

- Email: `admin@librechat.local`
- Password: `admin123`

## Main endpoints

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

### AI

- `GET /api/v1/ai/providers`
- `GET /api/v1/ai/models?provider=openai`
- `POST /api/v1/ai/chat`
- `POST /api/v1/ai/orchestrate`

### Example AI request

```bash
curl -X POST http://localhost:4000/api/v1/ai/chat \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "provider": "openai",
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Give me a short summary of modern AI trends"}],
    "temperature": 0.7
  }'
```

## Notes

This is a powerful starter scaffold. It supports broad model access via provider-specific HTTP requests and is designed for extension with Postgres, Prisma, Redis, and real agent orchestration later.
