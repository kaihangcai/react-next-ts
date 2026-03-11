# Plan — 2026-02-28-backend-consolidation

> Generated: 2026-02-28 00:00

## Objective
Eliminate the separate `react-next-backend` Express microservices by consolidating all API logic into Next.js Route Handlers inside `react-next-ts`, resulting in a single deployable unit backed by Prisma 6 + SQLite.

## Approach
Migrate data layer from JSON file storage to Prisma 6 + SQLite, replace NextAuth v4 with NextAuth v5, create Next.js Route Handlers for all three services (user/game/darkest), update frontend URLs from hardcoded localhost to relative paths, and swap MUI for shadcn/ui.

## Accepted Plan

# Plan: Consolidate Backend into react-next-ts

## Context

The project currently has two separate repositories:
- `react-next-backend` — 3 independent Express.js microservices (User: 4000, Game: 4001, Darkest: 4002), each with JSON file storage
- `react-next-ts` — Next.js 15 App Router frontend that calls those services via hardcoded `localhost` URLs

**Goal**: Eliminate the separate backend entirely by consolidating all API logic into Next.js Route Handlers inside `react-next-ts`. This reduces infrastructure from 4 running processes to 1, removes hardcoded localhost issues, simplifies auth, and gives a single deployable unit. The `react-next-backend` folder will be kept as-is for reference.

**Key architectural decisions made:**
- MUI replaced with shadcn/ui (lighter, Tailwind-native)
- Database: Prisma 6 + SQLite (zero infra for personal project)
- Auth: NextAuth v5 (required for App Router best practices)
- All 3 Express services → Next.js Route Handlers

---

## Implementation Plan

### Phase 1 — Database Setup (Prisma 6 + SQLite)
**Files to create/modify:**
- `react-next-ts/prisma/schema.prisma` (new)
- `react-next-ts/package.json` — add `prisma`, `@prisma/client` (v6); remove old `@prisma/client` v4

**Schema models needed:**
```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // bcrypt hash
  alias     String
  scores    GameRecord[]
}

model GameRecord {
  id       String @id @default(uuid())
  userId   String
  user     User   @relation(fields: [userId], references: [id])
  s_15 Int @default(0)  s_30 Int @default(0)  s_45 Int @default(0)  s_60 Int @default(0)
  m_15 Int @default(0)  m_30 Int @default(0)  m_45 Int @default(0)  m_60 Int @default(0)
  l_15 Int @default(0)  l_30 Int @default(0)  l_45 Int @default(0)  l_60 Int @default(0)
}

model DungeonRecommendation {
  dungeonId Int      @id
  data      String   // JSON blob (provisions, heroes, tips)
}
```

**Steps:**
1. `npm install prisma@6 @prisma/client@6 --save-dev/--save`
2. `npx prisma init --datasource-provider sqlite`
3. Write schema above
4. `npx prisma migrate dev --name init`
5. Seed from existing JSON data in backend's `data/*.json` files (optional one-time script)

---

### Phase 2 — NextAuth v5 Migration
**Files to modify:**
- `react-next-ts/src/lib/auth.ts` — rewrite for NextAuth v5 API
- `react-next-ts/src/app/api/auth/[...nextauth]/route.ts` — update export pattern
- `react-next-ts/src/types/next-auth.d.ts` — update session type augmentation

**Key v4 → v5 changes:**
- Config export: `export default NextAuth(config)` → `export const { handlers, auth, signIn, signOut } = NextAuth(config)`
- Route handler: `export { GET, POST }` from `handlers`
- Session access: `getServerSession(authOptions)` → `auth()` (no import needed, it's in scope)
- Credentials callback: `authorize()` signature is the same, but return type changes
- Token/session callbacks: `token` → `user` field naming changes

**Auth flow after migration:**
- Signup: POST to `/api/auth/signup` (new Route Handler) → Prisma create User
- Login: Credentials provider → Prisma lookup User → bcrypt verify → return user object
- Session: JWT with user id + alias, 1-hour expiry

---

### Phase 3 — API Route Handlers
**New files to create** in `react-next-ts/src/app/api/`:

```
api/
├── auth/
│   ├── [...nextauth]/route.ts   (already exists, updated in Phase 2)
│   └── signup/route.ts          (NEW — POST handler, replaces user service signup)
├── game/
│   └── route.ts                 (NEW — GET all scores, POST new score)
└── darkest/
    └── expedition/
        └── recommendations/
            └── [id]/
                └── route.ts     (NEW — GET recommendations, POST update)
```

**`api/auth/signup/route.ts`** (POST):
- Parse `{ username, password, alias }` from body
- Validate (same rules as current `user/utils/validator.ts`)
- Hash password with bcryptjs
- `prisma.user.create()`
- Return 201 with user id + alias

**`api/game/route.ts`** (GET / POST):
- GET: `prisma.gameRecord.findMany({ include: { user: true } })` → format as `[{ alias, id, scores }]`
- POST (auth required): validate score + state, upsert GameRecord for authenticated user

**`api/darkest/expedition/recommendations/[id]/route.ts`** (GET / POST):
- GET: `prisma.dungeonRecommendation.findUnique({ where: { dungeonId: id } })`
- POST: `prisma.dungeonRecommendation.upsert()`

---

### Phase 4 — Frontend URL Updates
**Files to modify:**
- `react-next-ts/src/store/score-context.tsx:81` — `http://localhost:4001/game` → `/api/game`
- `react-next-ts/src/app/(game)/darkest/page.tsx:35` — `http://localhost:4002/darkest/...` → `/api/darkest/...`
- `react-next-ts/src/hooks/use-http.tsx` — verify axios base URL uses relative paths
- `react-next-ts/src/lib/auth.ts` — `${process.env.BACKEND_USER_URL}/auth/login` → Prisma call directly (no HTTP)
- Remove `BACKEND_USER_URL` env var dependency

**Also fix in this phase:**
- `react-next-ts/src/hooks/use-memory-ai.tsx:143` — replace `document.getElementById().click()` with `useRef` + `ref.current.click()` (React-idiomatic)

---

### Phase 5 — MUI → shadcn/ui
**Packages to remove:** `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
**Packages to add:** `shadcn/ui` init + individual components, `lucide-react` (icons)

**MUI usages to migrate** (identified in audit):
| Location | MUI Usage | Replacement |
|----------|-----------|-------------|
| `src/components/Layout/Sidebar.tsx` | Grid, ChevronRight icon | Tailwind flex, Lucide `ChevronRight` |
| `src/components/UI/` button components | MUI Button | shadcn/ui `Button` |
| `src/components/AuthForm.tsx` | MUI form inputs | shadcn/ui `Input`, `Label` |
| Various pages | MUI icon references | Lucide React icons |

**Steps:**
1. `npx shadcn@latest init` (configure with Tailwind, existing color theme)
2. Add components: `npx shadcn@latest add button input label`
3. Swap component by component, verifying UI parity
4. Remove MUI packages

---

### Phase 6 — Cleanup & Config Fixes
**Files to modify:**
- `react-next-ts/package.json`:
  - Update `eslint-config-next` to `^15`
  - Remove old `@prisma/client@4`, `@types/bcryptjs` (already in prod deps), `react-next-ts: file:` self-reference
- `react-next-ts/.env.local` (create/update):
  - `AUTH_SECRET` (random string, required for NextAuth v5)
  - `DATABASE_URL=file:./dev.db`
  - Remove `BACKEND_USER_URL`, `BACKEND_GAME_URL`, `BACKEND_DARKEST_URL`

---

## Critical Files Reference

| File | Change |
|------|--------|
| `react-next-ts/prisma/schema.prisma` | Create new |
| `react-next-ts/src/lib/auth.ts` | Rewrite for NextAuth v5 |
| `react-next-ts/src/app/api/auth/[...nextauth]/route.ts` | Update exports |
| `react-next-ts/src/app/api/auth/signup/route.ts` | Create new |
| `react-next-ts/src/app/api/game/route.ts` | Create new |
| `react-next-ts/src/app/api/darkest/expedition/recommendations/[id]/route.ts` | Create new |
| `react-next-ts/src/store/score-context.tsx` | Fix URLs |
| `react-next-ts/src/app/(game)/darkest/page.tsx` | Fix URLs |
| `react-next-ts/src/hooks/use-memory-ai.tsx` | Fix DOM anti-pattern |
| `react-next-ts/src/components/Layout/Sidebar.tsx` | MUI → shadcn/ui |
| `react-next-ts/src/components/AuthForm.tsx` | MUI → shadcn/ui |
| `react-next-ts/package.json` | Dependency updates |

---

## Verification

1. `npm run build` in `react-next-ts` — zero TypeScript errors, zero ESLint warnings
2. `npx prisma studio` — verify all three models are populated after seeding
3. Manual test flow:
   - Sign up new user → user created in SQLite
   - Log in → JWT session set
   - Submit aim-trainer score → GameRecord upserted
   - View leaderboard → score shows with alias
   - Open Darkest Dungeon companion → dungeon recommendations load from DB
   - Update provisions → POST to `/api/darkest/...` persists
4. Verify no `localhost:400x` URLs remain in codebase: `grep -r "localhost:400" react-next-ts/src`
5. Confirm `react-next-backend` is untouched (archive)
