# Plan Review — 2026-03-01-wiki-pages

> Reviewed: 2026-03-01

## Summary

The plan is well-structured and ready to implement with minor adjustments. All imports and type references resolve correctly against the codebase. No conflicting files exist. The three MODIFY targets are confirmed as simple placeholder stubs. Two low-risk warnings are worth addressing before implementation begins: `Modal.tsx` should carry `"use client"` for portability (the plan omits it), and the `<Image fill>` call in WikiCard should include a `sizes` prop to suppress Next.js build warnings. No blockers found.

---

## ✅ Confirmed

- `src/models/darkest.ts` exists with `HeroClasses` (values 0–17, all 18 heroes) and `Dungeon` enums including `FARMSTEAD` used by `cultist-brawler`
- Relative import `from './darkest'` in `wiki.ts` is correct — both files will be co-located under `src/models/`
- All three MODIFY page files exist and contain only a plain placeholder div — no complex state or imports to preserve
- All three page files already have the `"use client"` directive at line 1 — the plan's instruction to add it is a no-op; implementer just needs to replace the file contents
- `src/components/UI/` exists; no `Modal.tsx` present (clean CREATE)
- `src/components/Darkest/` exists; no `WikiGrid.tsx` or `WikiCard.tsx` present (clean CREATE)
- `src/models/wiki.ts` and `src/data/` directory do not exist yet (no conflicts)
- `lucide-react@0.400.0` is installed — `X` icon is available
- All custom Tailwind colours used in the plan are defined in `tailwind.config.js`: `cool-gray-90`, `cool-gray-80`, `cool-gray-20`, `orange-30`
- Standard Tailwind colours used for tags (`text-blue-300`, `text-green-300`, `text-purple-300`, `text-yellow-400`, `text-red-400`) are all built-in Tailwind v3 utilities
- `grid-cols-10` is a valid default class in Tailwind v3.3.2 (native support up to `grid-cols-12`)
- `@/` path alias maps to `./src/*` in `tsconfig.json` — all `@/data/…`, `@/models/…`, `@/components/…` imports will resolve
- Tailwind config `content` array covers `src/components/**` and `src/app/**` — WikiCard/WikiGrid class strings will not be purged

---

## ⚠️ Warnings

1. **Modal.tsx omits `"use client"` directive**
   Plan says → Modal uses `useEffect` (ESC listener) and `document.body.style.overflow` (scroll lock)
   Found → No `"use client"` mentioned for Modal.tsx in the plan
   Fix → Add `"use client"` as the first line of `Modal.tsx`. It will work as-is when imported from client pages, but omitting it makes it silently unsafe for any future server-component caller.

2. **All three page files already carry `"use client"`**
   Plan says → "add `use client`" as part of modifying the page files
   Found → All three pages already have `"use client"` at line 1
   Fix → No action needed; simply replace the file content. Update the checklist wording to reflect this.

3. **`<Image fill>` in WikiCard has no `sizes` prop**
   Plan says → `<Image src={imagePath} alt={name} fill className="object-contain" />`
   Found → Next.js 15 emits a build warning when `fill` is used without `sizes`; no `sizes` prop specified in the plan
   Recommended fix → Add `sizes="(max-width: 640px) 33vw, 20vw"` (or a reasonable default) to suppress the warning

4. **`next.config.js` is empty — external `imagePath` values will fail at runtime**
   Plan says → `imagePath` is optional and reserved for later
   Found → `next.config.js = {}` — any future external URL in `imagePath` (e.g. from a CDN) will throw an "unallowed hostname" error
   Recommended fix → Document in `decisions.md` that external image URLs will require `remotePatterns` in `next.config.js` before they can be used

---

## ❌ Blockers

None. The plan is implementable as written (with the warnings above addressed).

---

## 📋 Checklist Audit

- **Coverage:** All 10 plan action items are represented as checklist tasks. ✅
- **Phase ordering:** Phases 1 → 2 → 3 → 4 → 5 → 6 → 7 follow the plan's dependency order (model → components → data → pages → verify). ✅
- **Missing items:**
  - No checklist item for adding `"use client"` to `Modal.tsx` (follows from Warning 1)
  - No checklist item for adding `sizes` prop to `<Image fill>` in WikiCard (follows from Warning 3)
- **Stale wording:** Phase 6 items say "add 'use client'" — pages already have it; wording should be "replace page content" to avoid confusion

---

## 💡 Suggestions

1. **Add `"use client"` to `Modal.tsx`** — Makes the component safely portable if it's ever used outside the current page tree. Low effort, zero risk.
2. **Add `sizes` prop to `<Image fill>` in WikiCard** — Eliminates Next.js build-time performance warnings before they appear. One line of code.
3. **WikiCard initial letter: use `name[0].toUpperCase()`** — Guarantees uppercase display regardless of how the name is stored in data. Minor but consistent.
4. **Document the `remotePatterns` requirement in `decisions.md`** — Captures the knowledge that external image URLs need a `next.config.js` change so it isn't forgotten when real art assets are added.
5. **Consider named `export default function` style for components** — The rest of the codebase (e.g. `RosterHeroCard.tsx`, `Button.tsx`) uses named function declarations. Arrow-function const components are fine but keeping the style consistent avoids friction in code review.
