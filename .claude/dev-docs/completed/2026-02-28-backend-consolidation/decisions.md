# Key Files & Decisions — 2026-02-28-backend-consolidation

> Last Updated: 2026-03-01 18:00

## Key Files

### Infrastructure & Auth
| File | Change |
|------|--------|
| `react-next-ts/prisma/schema.prisma` | Create new — User, GameRecord, DungeonRecommendation models |
| `react-next-ts/prisma/seed.ts` | Create seed script — loads 7 DungeonRecommendation records from `react-next-backend/darkest/data/expeditions.json` |
| `react-next-ts/package.json` | Add prisma@6 + @prisma/client@6 + lucide-react, bump next-auth→5 + eslint-config-next→^15, remove MUI/emotion + react-next-ts:file: self-ref |
| `react-next-ts/.env.local` | Create — AUTH_SECRET + DATABASE_URL=file:./dev.db |
| `react-next-ts/src/lib/prisma.ts` | Create Prisma client singleton |
| `react-next-ts/src/lib/auth.ts` | Rewrite for NextAuth v5 API; replace HTTP call to backend with Prisma lookup; drop tokenExpiry/isExpired |
| `react-next-ts/src/types/next-auth.d.ts` | Update session type — keep id, add alias; remove token/tokenExpiry/isExpired |
| `react-next-ts/src/app/api/auth/[...nextauth]/route.ts` | Update exports to NextAuth v5 pattern (`handlers`) |
| `react-next-ts/src/app/api/session/route.ts` | Replace `getServerSession(authOptions)` → `auth()` |

### New Route Handlers
| File | Change |
|------|--------|
| `react-next-ts/src/app/api/auth/signup/route.ts` | Create POST handler — validate, bcrypt hash, prisma.user.create + GameRecord |
| `react-next-ts/src/app/api/game/route.ts` | Create GET (all scores formatted as {alias,id,scores}) + POST (auth via auth(), only update if new highscore) |
| `react-next-ts/src/app/api/darkest/expedition/recommendations/[id]/route.ts` | Create GET (parse JSON blob) + POST (upsert JSON blob); 7 dungeon records total |

### Frontend URL & Session Fixes
| File | Change |
|------|--------|
| `react-next-ts/src/store/score-context.tsx` | Fix URL localhost:4001/game → /api/game; remove Authorization Bearer header (GET is public) |
| `react-next-ts/src/app/auth/page.tsx` | Fix signup URL BACKEND_USER_URL → /api/auth/signup; simplify error handling (v5 no longer exposes raw throw message) |
| `react-next-ts/src/components/AimLab/TargetWindow.tsx` | Fix URL BACKEND_GAME_URL → /api/game; replace `user.isExpired` check with `status === "authenticated"`; remove token from sendRequest |
| `react-next-ts/src/app/server/page.tsx` | Replace getServerSession → auth(); update displayed fields (alias instead of token/tokenExpiry) |

### MUI → Lucide / Tailwind (full audit — 9 files)
| File | MUI Usage | Replacement |
|------|-----------|-------------|
| `src/components/Layout/Sidebar.tsx` | `ChevronRight` from `@mui/icons-material` | `ChevronRight` from `lucide-react` |
| `src/components/AimLab/TargetNavigation.tsx` | `RefreshIcon`, `KeyboardArrowUp`, `KeyboardArrowDown` from `@mui/icons-material/*` | `RotateCcw`, `ChevronUp`, `ChevronDown` from `lucide-react` |
| `src/components/Maze/Pagination.tsx` | `Box`, `Pagination` from `@mui/material` | Tailwind `div` + custom numbered button row |
| `src/app/(game)/darkest/expedition/page.tsx` | `Grid` from `@mui/material` | `div` with Tailwind flex classes |
| `src/components/Darkest/DungeonRecommendations.tsx` | `Grid` from `@mui/material` | `div` with Tailwind flex classes |
| `src/components/Darkest/DungeonSelector.tsx` | `Grid`, `Grid item xs={2}` from `@mui/material` | `div` with Tailwind flex + cursor-pointer |
| `src/components/Darkest/DurationSelector.tsx` | `Grid`, `Grid item xs={2}` from `@mui/material` | `div` with Tailwind flex + cursor-pointer |
| `src/components/Darkest/Bag.tsx` | `Grid container`, `Grid` from `@mui/material` | `div` with Tailwind flex-wrap |
| `src/components/Darkest/ItemDisplay.tsx` | `Grid item xs={2}`, inner `Grid` from `@mui/material` | `div` with Tailwind relative + flex |

### No-op (plan was wrong)
| File | Finding |
|------|---------|
| `src/components/UI/Button.tsx` | Already pure Tailwind — no MUI |
| `src/components/AuthForm.tsx` | Already plain HTML inputs + Tailwind — no MUI |
| `src/hooks/use-http.tsx` | Already uses relative URL (no base URL hardcoded) — ✓ verified |

## Architectural Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Prisma 6 + SQLite | Zero infrastructure for personal project; no separate DB server | SQLite not suitable for high concurrency; fine for personal use |
| NextAuth v5 | Required for Next.js 15 App Router best practices; server components support | Breaking change from v4; migration effort required |
| shadcn/ui over MUI | Lighter, Tailwind-native, no emotion runtime overhead | Less component variety; more manual styling needed |
| Route Handlers over Server Actions | Closer 1:1 mapping to existing Express endpoints; easier to reason about | Could use Server Actions for mutation-only paths in future |
| Keep `react-next-backend` as archive | Low risk — don't delete working code; useful as reference | Minor clutter in monorepo |
| Single GameRecord per user (upsert) | Matches existing backend behavior; simpler leaderboard queries | Loses score history over time |

## Deviations from Plan

| Deviation | Reason |
|-----------|--------|
| `next-auth@^5` → `next-auth@5.0.0-beta.30` | v5 is still in beta; `^5` resolves to nothing on npm; pinned exact beta version |
| `auth/page.tsx` login error handling simplified | NextAuth v5 no longer exposes raw `Error.message` through `result.error` for security; now shows generic "Invalid username or password." instead of JSON-parsed backend error |
| `use-memory-ai.tsx` `document.getElementById` fix deferred | Proper ref-based approach requires refactoring Card component to expose refs — outside scope of this consolidation task |
| Added `<Suspense>` wrapper to auth page | Next.js 15 requires `useSearchParams()` to be inside a Suspense boundary during static generation |
| Added `eslint-disable-next-line` in Bag.tsx + DungeonRecommendations.tsx | Pre-existing `react-hooks/exhaustive-deps` warnings from original code; suppressed rather than changed dependency semantics |
| `shadcn/ui` not installed | Audit revealed no MUI form components in use — AuthForm.tsx and Button.tsx already used plain Tailwind; only icons + Grid needed replacement (lucide-react + Tailwind divs) |
| MUI scope was larger than plan estimated | Plan listed 3 files; actual audit found 9 files with MUI (added Bag, ItemDisplay, DungeonSelector, DurationSelector, DungeonRecommendations, Maze/Pagination, TargetNavigation) |
| Created `.env` in addition to `.env.local` | Prisma CLI reads `.env` not `.env.local`; `.env` holds DATABASE_URL for CLI use, `.env.local` holds AUTH_SECRET + DATABASE_URL for Next.js runtime |
| Added `trustHost: true` to NextAuth config | NextAuth v5 rejects requests with an untrusted host by default; required for `localhost` dev and reverse-proxy deployments |
| Added `AUTH_URL=http://localhost:3000` to `.env.local` | NextAuth v5 requires explicit host allowlisting via `AUTH_URL` even with `trustHost: true` in config; must be set to the production domain on deployment |
