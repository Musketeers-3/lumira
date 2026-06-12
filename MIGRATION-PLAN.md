# Lumira MERN Migration Plan

## Overview
Migrate from TanStack Start + Supabase to React (TanStack Router) + Express + MongoDB architecture.

## Current Architecture
- **Frontend**: TanStack Start + TanStack Router + React 19
- **Data Storage**: Supabase (mock fallback when unavailable)
- **AI**: Ollama at localhost:11434
- **Auth**: Supabase Auth
- **Local**: localStorage for lesson drafts, mentor settings

## Target Architecture
- **Frontend**: React + TanStack Router (keep existing)
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT with bcrypt
- **AI**: Ollama calls through backend

---

## Phase 1: Backend Creation

### 1.1 Folder Structure
```
/server
  /config
    db.js           - MongoDB connection
    env.js          - Environment validation
  /controllers
    authController.js
    sessionController.js
    skillController.js
    lessonController.js
    aiController.js
  /models
    User.js
    LearningSession.js
    SessionMessage.js
    SkillTracking.js
    LessonDraft.js
  /routes
    authRoutes.js
    sessionRoutes.js
    skillRoutes.js
    lessonRoutes.js
    aiRoutes.js
  /middlewares
    authMiddleware.js
    errorMiddleware.js
  /services
    aiService.js
    authService.js
  server.js
  package.json
  .env
```

### 1.2 MongoDB Models

**User**
- _id, email, password (hashed), name, createdAt, updatedAt

**LearningSession**
- _id, userId, lessonId, topic, startedAt, completedAt, durationSeconds, performanceScore, stateProgression (array), messagesCount, breakthrough, createdAt

**SessionMessage**
- _id, sessionId, userId, mentorState, messageText, sender, messageType, createdAt

**SkillTracking**
- _id, userId, skillName, skillCategory, proficiencyLevel, masteryScore, lastPracticed, timesPracticed, unlockedAt, insight, status, rarity

**LessonDraft**
- _id, userId, title, description, topic, targetSkills, difficulty, steps, estimatedDuration, isPublished, createdAt, updatedAt

### 1.3 API Endpoints

**Auth**
- POST /api/auth/register - Create account
- POST /api/auth/login - Login, get JWT
- GET /api/auth/me - Get current user

**Sessions**
- POST /api/sessions - Create session
- PUT /api/sessions/:id - Update session
- PUT /api/sessions/:id/complete - Complete session
- GET /api/sessions - Get user's sessions
- GET /api/sessions/recent - Get recent sessions

**Messages**
- POST /api/sessions/:id/messages - Save message
- GET /api/sessions/:id/messages - Get session messages

**Skills**
- GET /api/skills - Get user skills
- GET /api/skills/:skillName - Get specific skill
- PUT /api/skills - Update skill mastery

**AI**
- POST /api/ai/socratic - Generate Socratic response
- POST /api/ai/evaluate - Evaluate understanding
- POST /api/ai/breakthrough - Generate breakthrough message

**Lessons**
- GET /api/lessons - Get user's lesson drafts
- POST /api/lessons - Save lesson draft
- PUT /api/lessons/:id - Update lesson
- DELETE /api/lessons/:id - Delete lesson
- PUT /api/lessons/:id/publish - Publish lesson

---

## Phase 2: Frontend Changes

### 2.1 New API Layer
Create `/src/services/api/`:
- apiClient.ts - Axios instance with JWT interceptor
- authApi.ts - Auth endpoints
- sessionApi.ts - Session endpoints
- skillApi.ts - Skill endpoints
- aiApi.ts - AI endpoints
- lessonApi.ts - Lesson endpoints

### 2.2 Environment Files

**.env (Frontend)**
```
VITE_API_URL=http://localhost:5000/api
```

**.env (Backend)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lumira
JWT_SECRET=your-secret-key-here
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2:1.5b
```

### 2.3 Updated Imports

Replace Supabase calls:
- `learning-persistence.ts` → API calls via services
- `supabase/client.ts` → Remove (use apiClient)
- `ai-mentor.ts` → Call backend AI endpoints

### 2.4 Authentication State

Add context for JWT auth:
- AuthProvider in __root.tsx
- Store token in localStorage
- Attach token to all API requests

---

## Phase 3: Migration Details

### 3.1 Auth Flow
1. User registers → POST /api/auth/register
2. User logs in → POST /api/auth/login → receives JWT
3. JWT stored in localStorage
4. apiClient attaches JWT to Authorization header
5. authMiddleware validates JWT on protected routes

### 3.2 AI Integration
1. Frontend calls /api/ai/socratic with context
2. Backend fetches skill history from MongoDB
3. Backend calls Ollama with compiled prompt
4. Backend returns response to frontend

### 3.3 Data Migration Notes
- No direct migration from Supabase (fresh MongoDB)
- Seed data can be provided for demo

---

## File Changes Summary

### Created (Backend)
1. server/package.json
2. server/.env
3. server/server.js
4. server/config/db.js
5. server/config/env.js
6. server/models/User.js
7. server/models/LearningSession.js
8. server/models/SessionMessage.js
9. server/models/SkillTracking.js
10. server/models/LessonDraft.js
11. server/controllers/authController.js
12. server/controllers/sessionController.js
13. server/controllers/skillController.js
14. server/controllers/lessonController.js
15. server/controllers/aiController.js
16. server/routes/authRoutes.js
17. server/routes/sessionRoutes.js
18. server/routes/skillRoutes.js
19. server/routes/lessonRoutes.js
20. server/routes/aiRoutes.js
21. server/middlewares/authMiddleware.js
22. server/middlewares/errorMiddleware.js
23. server/services/aiService.js
24. server/services/authService.js

### Created (Frontend)
1. frontend/.env
2. frontend/src/services/api/apiClient.ts
3. frontend/src/services/api/authApi.ts
4. frontend/src/services/api/sessionApi.ts
5. frontend/src/services/api/skillApi.ts
6. frontend/src/services/api/aiApi.ts
7. frontend/src/services/api/lessonApi.ts
8. frontend/src/lib/auth-context.tsx (or update existing)

### Modified
1. frontend/src/lib/learning-persistence.ts - Use API services
2. frontend/src/lib/ai-mentor.ts - Call backend API
3. frontend/src/lib/supabase/client.ts - Remove or keep as no-op
4. frontend/src/hooks/useSessionPersistence.ts - Update imports
5. frontend/package.json - Add axios, remove Supabase
6. Other files that import from learning-persistence

### Deleted/Deprecated
1. frontend/src/lib/supabase/client.ts (or mark deprecated)
2. Any Supabase-specific code

---

## Installation Commands

```bash
# Backend
cd server
npm install express mongoose dotenv cors bcryptjs jsonwebtoken axios
npm install -D nodemon

# Frontend (already has dependencies)
cd ../lumira
npm install axios
npm uninstall @supabase/ssr @supabase/supabase-js
```

## Run Commands

```bash
# Backend (terminal 1)
cd server
npm run dev  # or: node server.js

# Frontend (terminal 2)
cd lumira
bun run dev
```