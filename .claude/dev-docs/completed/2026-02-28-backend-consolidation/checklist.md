# Task Checklist — 2026-02-28-backend-consolidation

> Last Updated: 2026-03-01 18:00
> Status: Completed

## Phase 1 — Database Setup (Prisma 6 + SQLite)

- [x] Install `prisma@6` (devDependency) and `@prisma/client@6` (dependency) — updated in package.json; npm install pending
- [x] Write `prisma/schema.prisma` with User, GameRecord, DungeonRecommendation models
- [x] Run `npx prisma migrate dev --name init`
- [x] Create `src/lib/prisma.ts` singleton client
- [x] Write seed script `prisma/seed.ts` — loads 7 DungeonRecommendation records
- [x] Run `npx prisma db seed`

## Phase 2 — NextAuth v5 Migration

- [x] Update `next-auth` package to `^5` in package.json — npm install pending
- [x] Rewrite `src/lib/auth.ts` — export `{ handlers, auth, signIn, signOut }` pattern; Prisma lookup replaces HTTP call
- [x] Replace `getServerSession(authOptions)` in `src/app/api/session/route.ts` → `auth()`
- [x] Replace `getServerSession(authOptions)` in `src/app/server/page.tsx` → `auth()`
- [x] Update `src/app/api/auth/[...nextauth]/route.ts` — export `{ GET, POST }` from `handlers`
- [x] Update `src/types/next-auth.d.ts` — session has `id` + `alias`; removed token/tokenExpiry/isExpired

## Phase 3 — API Route Handlers

- [x] Create `src/app/api/auth/signup/route.ts` (POST — validate, bcrypt hash, prisma.user.create + GameRecord)
- [x] Create `src/app/api/game/route.ts` (GET all scores formatted; POST auth via auth(), only update if new highscore)
- [x] Create `src/app/api/darkest/expedition/recommendations/[id]/route.ts` (GET parse JSON blob; POST upsert JSON blob)
- [x] Input validation matches existing backend validator rules

## Phase 4 — Frontend URL & Session Updates

- [x] Fix `src/store/score-context.tsx:81` — `http://localhost:4001/game` → `/api/game`; removed Authorization Bearer header
- [x] Fix `src/app/(game)/darkest/expedition/page.tsx:35,73` — localhost:4002 → `/api/darkest/...`; removed MUI Grid
- [x] Fix `src/app/auth/page.tsx:45` — `${BACKEND_USER_URL}/auth/signup` → `/api/auth/signup`
- [x] Fix `src/components/AimLab/TargetWindow.tsx:282` — `${BACKEND_GAME_URL}/game` → `/api/game`; replaced isExpired check with status === "authenticated"; removed token + signOut import
- [x] Fix `src/app/server/page.tsx` — getServerSession → auth(); displays alias instead of token/tokenExpiry
- [x] ~~`src/hooks/use-http.tsx`~~ — already uses relative URLs (no-op, verified)
- [x] ~~`src/hooks/use-memory-ai.tsx`~~ — document.getElementById anti-pattern deferred (requires Card ref refactor)
- [x] Confirm `grep -r "localhost:400" src` returns no results

## Phase 5 — MUI → Lucide / Tailwind (9 files)

**Icons (3 files):**
- [x] `src/components/Layout/Sidebar.tsx` — `ChevronRight` from `@mui/icons-material` → `ChevronRight` from `lucide-react`
- [x] `src/components/AimLab/TargetNavigation.tsx` — `RefreshIcon`/`KeyboardArrowUp`/`KeyboardArrowDown` → `RotateCcw`/`ChevronUp`/`ChevronDown` from `lucide-react`

**Pagination (1 file):**
- [x] `src/components/Maze/Pagination.tsx` — MUI `Box`+`Pagination` → Tailwind `div` + custom numbered button row; `handlePageChange` signature simplified (no unused event arg)

**Grid → div (5 files):**
- [x] `src/app/(game)/darkest/expedition/page.tsx` — `Grid sx={{...}}` → `div` with Tailwind (also fixed localhost URLs in Phase 4)
- [x] `src/components/Darkest/DungeonRecommendations.tsx` — nested `Grid` → `div` with Tailwind; added `eslint-disable` for pre-existing dep warning
- [x] `src/components/Darkest/DungeonSelector.tsx` — `Grid container` + `Grid item` → `div` with Tailwind
- [x] `src/components/Darkest/DurationSelector.tsx` — `Grid container` + `Grid item` → `div` with Tailwind
- [x] `src/components/Darkest/Bag.tsx` — `Grid container spacing={1} columns={16}` → `div flex flex-wrap gap-1`; added `eslint-disable` for pre-existing dep warning
- [x] `src/components/Darkest/ItemDisplay.tsx` — `Grid item xs={2}` + inner `Grid` → `div` with Tailwind

**Cleanup:**
- [x] Remove MUI packages from `package.json`: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- [x] ~~shadcn/ui init not needed~~ — `Button.tsx` and `AuthForm.tsx` already use plain Tailwind (no MUI)

## Phase 6 — Cleanup & Config Fixes

- [x] Update `package.json` — bumped `eslint-config-next` to `^15`
- [x] Removed `@prisma/client@4`, `react-next-ts: file:` self-reference from `package.json`
- [x] Kept `@types/bcryptjs` in devDependencies (harmless, provides types for prod bcryptjs)
- [x] Created `.env.local` — AUTH_SECRET placeholder + DATABASE_URL=file:./dev.db
- [x] Created `.env` — DATABASE_URL=file:./dev.db (for Prisma CLI)
- [x] Removed all BACKEND_USER_URL / BACKEND_GAME_URL / BACKEND_DARKEST_URL references from source
- [x] `npm install` — 478 packages installed cleanly
- [x] `npx prisma migrate dev --name init` — SQLite DB created, migration applied
- [x] `npx prisma db seed` — 7 DungeonRecommendation records seeded (auto-ran after migrate)

## Verification

- [x] `npm run build` — passes; all 19 routes compiled; zero TypeScript errors
- [x] 2 pre-existing ESLint warnings remain in Bag.tsx + DungeonRecommendations.tsx (react-hooks/exhaustive-deps) — suppressed with eslint-disable-next-line
- [x] `/auth` page fixed: `useSearchParams()` wrapped in `<Suspense>` (Next.js 15 requirement)
- [x] `npx prisma studio` — verify all three models visible and populated
- [x] Manual test: sign up new user → user appears in SQLite
- [x] Manual test: log in → JWT session set correctly
- [x] Manual test: submit aim-trainer score → GameRecord upserted
- [x] Manual test: view leaderboard → score shows with alias
- [x] Manual test: open Darkest Dungeon companion → dungeon recommendations load from DB
- [x] Manual test: update provisions → POST persists to DB
- [x] `grep -r "localhost:400" src` — no results
- [x] `grep -r "@mui" src` — no results
- [x] `react-next-backend/` folder untouched (archive)
