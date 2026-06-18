# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lumira is an AI-powered learning platform with a 3D mentor character. It uses a MERN stack architecture:
- **Frontend**: React 19 + TanStack Router + TanStack Query + React Three Fiber (3D rendering)
- **Backend**: Express.js + MongoDB (Mongoose ODM) + JWT authentication
- **Deployment**: Cloudflare Pages (frontend), custom Node server (backend)
- **AI**: Ollama (local LLM) for Socratic mentoring

## Commands

### Frontend Development
```bash
bun run dev              # Start development server
bun run build            # Build for production (Cloudflare Pages)
bun run build:dev        # Build in development mode
bun run preview          # Preview production build
bun run lint             # Run ESLint
bun run format           # Format with Prettier
bun run generate:mentor # Generate placeholder 3D mentor GLB
```

### Backend Development
```bash
cd server
npm run dev          # Start with nodemon (auto-reload) on port 5001
npm start            # Start production server
```

### Running Both
Requires two terminals:
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
bun run dev
```

## Architecture

### Frontend Structure (`/src`)
- `routes/` - TanStack Router route definitions (file-based routing)
- `lib/` - Core utilities and contexts:
  - `auth-context.tsx` - JWT authentication state
  - `learning-persistence.ts` - Session data storage
  - `ai-mentor.ts` - AI mentor integration
  - `mentor-*.ts` - 3D mentor personality and animation contexts
  - `realms.ts`, `realm-context.tsx` - Learning world/realm management
  - `useRealmAudio.tsx` - Audio management
- `components/ui/` - Radix UI + shadcn/ui components
- `components/socratic/` - Socratic dialogue UI
- `components/lesson-builder/` - Lesson creation UI
- `services/api/` - API client layer with JWT interceptors

### Backend Structure (`/server`)
- `server.js` - Express app entry point
- `config/` - Database and environment configuration
- `models/` - Mongoose schemas (User, LearningSession, SessionMessage, SkillTracking, LessonDraft)
- `controllers/` - Request handlers for each domain
- `routes/` - Express routers with auth middleware
- `middlewares/` - JWT auth and error handling
- `services/` - AI service (Ollama integration), auth service

### API Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login, receive JWT
- `GET /api/auth/me` - Get current user
- `POST /api/sessions` - Create learning session
- `GET /api/sessions` - Get user's sessions
- `POST /api/sessions/:id/messages` - Save message
- `GET /api/skills` - Get user skills
- `POST /api/ai/socratic` - Generate Socratic response
- `GET/POST/PUT/DELETE /api/lessons` - Lesson drafts CRUD

## Key Technical Details

### Environment Variables
- Frontend: `.env` with `VITE_API_URL` (defaults to `http://localhost:5001/api`)
- Backend: `server/.env` with `PORT`, `MONGODB_URI`, `JWT_SECRET`, `OLLAMA_BASE_URL`

### 3D Mentor
The mentor is a VRM model rendered with React Three Fiber + @pixiv/three-vrm. Key files:
- `src/lib/mentor-animation-context.tsx` - Animation state
- `src/lib/mentor-personality.ts` - Personality traits and response patterns
- `src/lib/mentor-memory.ts` - Conversation history

The mentor asset (`public/models/mentor/lumira.glb`) uses animation clips mapped to learning states:
- `idle_breathe` → IDLE state
- `focus_listen` → FOCUS state
- `challenge_present` → CHALLENGE state
- `celebrate_quiet` → CELEBRATE state
- `speak_add` → additive layer when `isSpeaking`

Use `bun run generate:mentor` to create a placeholder GLB; replace with a Blender-authored asset following the spec in `docs/mentor-asset-spec.md`.

### Authentication Flow
1. User registers/logs in → receives JWT token
2. Token stored in localStorage
3. `apiClient.ts` attaches token to Authorization header
4. Protected routes require valid JWT via `authMiddleware`

## Important Notes

- The vite config uses `@lovable.dev/vite-tanstack-config` - do not manually add plugins that are already included
- Frontend builds for Cloudflare Pages via `@cloudflare/vite-plugin` configured in `wrangler.jsonc`
- AI features require a running Ollama instance (default: localhost:11434)
- MongoDB must be running for backend to function
- Frontend runs on port 5173 (Vite default), backend on port 5001