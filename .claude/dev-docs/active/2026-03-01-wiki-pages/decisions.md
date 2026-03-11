# Key Files & Decisions — 2026-03-01-wiki-pages

> Last Updated: 2026-03-01 00:01

## Key Files

| File | Change |
|------|--------|
| `react-next-ts/src/models/wiki.ts` | CREATE — WikiTag, HeroEntry, EnemyEntry, CurioEntry interfaces |
| `react-next-ts/src/models/darkest.ts` | READ ONLY — source of HeroClasses enum and Dungeon enum (imported by wiki.ts) |
| `react-next-ts/src/data/heroes.ts` | CREATE — 18 HeroEntry objects exported as HEROES array |
| `react-next-ts/src/data/enemies.ts` | CREATE — 6 EnemyEntry sample objects exported as ENEMIES array |
| `react-next-ts/src/data/curios.ts` | CREATE — 8 CurioEntry sample objects exported as CURIOS array |
| `react-next-ts/src/components/UI/Modal.tsx` | CREATE — generic reusable overlay modal with ESC/backdrop close |
| `react-next-ts/src/components/Darkest/WikiGrid.tsx` | CREATE — grid wrapper with 3/5/10 column selector |
| `react-next-ts/src/components/Darkest/WikiCard.tsx` | CREATE — card with image placeholder, name, tags |
| `react-next-ts/src/app/(game)/darkest/heroes/page.tsx` | MODIFY — replace placeholder with WikiGrid + WikiCard + Modal |
| `react-next-ts/src/app/(game)/darkest/enemies/page.tsx` | MODIFY — replace placeholder with WikiGrid + WikiCard + Modal |
| `react-next-ts/src/app/(game)/darkest/curios/page.tsx` | MODIFY — replace placeholder with WikiGrid + WikiCard + Modal |

## Architectural Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Static TypeScript data files in `src/data/` | No backend needed; type-safe at compile time; easy to extend | Data lives in code bundle; not editable without a redeploy |
| Pre-computed `tags` on each data object | Keeps WikiCard purely presentational with no knowledge of entry type | Slight duplication — tag logic must be repeated per data file |
| Static Tailwind class map in WikiGrid | Tailwind purges dynamically constructed class strings; static map guarantees classes are present in bundle | Slightly more verbose; must add entry to map for new column counts |
| Modal returns null when closed | Ensures children (and their effects/fetches) don't run when modal is hidden | None — this is the idiomatic React pattern |
| `"use client"` on all three pages | useState/modal interactivity requires client component | These pages are purely informational so SSR benefit is minimal |
| `src/data/` directory (new) | Clean separation of static content from model types | Creates a new directory convention — ensure team is aware |
| `"use client"` on `Modal.tsx` | Modal uses `useEffect` (ESC listener) and `document.body.style.overflow` — directive added for portability even though the current callers are client pages | Negligible — no downside to being explicit |
| `next.config.js` `remotePatterns` deferred | All current data objects omit `imagePath`; no external images served yet | When real art assets are added, `next.config.js` must be updated with `remotePatterns` or the images will fail with an "unallowed hostname" error |

## Deviations from Plan
*(Updated during execution — record any mid-task pivots here)*
