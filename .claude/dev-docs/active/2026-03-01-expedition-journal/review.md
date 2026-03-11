# Plan Review — 2026-03-01-expedition-journal
> Reviewed: 2026-03-01

## Summary

The plan is well-structured and the implementation order is sound. All referenced utility
constants, existing components, and API patterns exist and are at the paths the plan
expects. However, **three blockers** will cause TypeScript compile errors if not addressed
before implementation: a wrong claim about existing imports in `expedition.ts`, the
`Button` component lacking a `disabled` prop, and a type mismatch in `ClickableItemGrid`'s
`maxPerItem` interface vs. the shape of `PROVISION_MAX_STACK`. Fix these three issues and
the plan is ready to implement.

---

## ✅ Confirmed

- `react-next-ts/prisma/schema.prisma` exists; `User` has no existing `expeditionLogs`
  field and no `ExpeditionLog` model — schema addition is clean with no conflicts.
- `react-next-ts/src/models/expedition.ts` exists; `Provisions` and `Loot` interfaces
  are defined there exactly as the plan assumes.
- `react-next-ts/src/models/darkest.ts` exports `Dungeon`, `DungeonLength`,
  `DungeonDifficulty`, `GameDifficulty`, `HeroClasses` — all types used in the new
  interfaces exist at the correct path.
- `DungeonSelector` (`src/components/Darkest/DungeonSelector.tsx`) and `DurationSelector`
  (`DurationSelector.tsx`) both exist with exactly the `selected` + `handleClick` prop
  signatures the form intends to reuse.
- `PROVISION_IMG_SRC` and `LOOT_STRINGS` both confirmed in
  `src/utils/Constants/image.ts`; types are `Record<keyof Provisions, string>` and
  `Record<keyof Loot, string>` respectively — compatible with `ClickableItemGrid`'s
  `images: Record<string, string>`.
- `PROVISION_MAX_STACK` confirmed in `src/utils/Constants/shop.ts`.
- `mapDungeonToIndex` confirmed in `src/utils/Constants/constants.ts`; all 7 `Dungeon`
  values are handled in the switch.
- `Button` component exists at `src/components/UI/Button.tsx`.
- `auth` and `prisma` import paths (`@/lib/auth`, `@/lib/prisma`) confirmed via existing
  `src/app/api/game/route.ts` — the pattern the new log route mirrors.
- Recommendations API at `src/app/api/darkest/expedition/recommendations/[id]/route.ts`
  confirmed; returns the `DungeonRecommendation` shape the form's `useEffect` expects
  (`data.provisions[duration]`).
- None of the 10 CREATE files exist yet — no conflicts.
- `expedition/page.tsx` is already `"use client"` and uses `useState`/`useEffect` —
  tab state addition requires no new directive.

---

## ⚠️ Warnings

- **`ItemDisplay` badge style mismatch.** The plan says `ClickableItemGrid` reuses the
  "existing `ItemDisplay` badge style", but `ItemDisplay.tsx` uses a yellow inline `<p>`
  with absolute positioning — not the Tailwind `bg-cool-gray-100` classes the plan
  describes. The plan is actually defining a *new* badge style. No code reuse happens
  here; the description is slightly misleading but the proposed Tailwind classes are fine.

- **`mapDungeonToIndex` can return `undefined`.** TypeScript infers the return type as
  `number | undefined` because the function has no explicit return type annotation and
  a code path exists where it falls off the switch (e.g. if dungeon is `undefined` the
  early return handles it, but TypeScript may still infer `undefined`). The existing
  page guards this with `if(selectedDungeon && selectedDuration)`. The plan's `useEffect`
  for provision pre-fill should include the same guard.

- **Casualties not reset when heroes change.** If a user selects 4 heroes, marks 2 as
  casualties, then changes hero selection, the casualties array may contain hero values
  no longer in the heroes array. `CasualtySelector` only *displays* the intersection, but
  the submitted `casualties` state will still contain stale values.

---

## ❌ Blockers

**Blocker 1 — `expedition.ts` imports are incomplete.**

> **Plan says:** "Dungeon, DungeonLength, DungeonDifficulty, GameDifficulty, HeroClasses
> are already imported from `./darkest` at the top of this file."
>
> **Reality:** `expedition.ts` line 1 is:
> `import { Dungeon, DungeonLength } from './darkest';`
> `DungeonDifficulty`, `GameDifficulty`, and `HeroClasses` are **not imported**.
>
> **Required fix:** Update the import line to:
> `import { Dungeon, DungeonLength, DungeonDifficulty, GameDifficulty, HeroClasses } from './darkest';`
> The Phase 2 checklist has no item for this step — add one before implementation.

---

**Blocker 2 — `Button` component has no `disabled` prop.**

> **Plan says:** "Submit → reuse existing `Button` component; disabled + 'Saving…' text
> while `isSubmitting`."
>
> **Reality:** `Button`'s props are `{ label, onClick?, className? }` only. There is no
> `disabled` prop; the underlying `<button>` element's disabled attribute is never set.
> Passing `disabled={isSubmitting}` to `<Button>` will be a TypeScript error.
>
> **Required fix (choose one):**
> - Extend `Button` to accept `disabled?: boolean` and pass it to the `<button>` element.
> - Replace the submit with a raw `<button disabled={isSubmitting}>` in `ExpeditionLogForm`
>   rather than the `Button` component.

---

**Blocker 3 — `ClickableItemGrid`'s `maxPerItem` type cannot enforce per-item provision caps.**

> **Plan says:** "`maxPerItem?: number` — optional cap per item" and the form should cap
> provisions "at `PROVISION_MAX_STACK` per item."
>
> **Reality:** `PROVISION_MAX_STACK` is `Record<keyof Provisions, number>` — each item
> has a *different* maximum (e.g. `food: 12`, `fireWood: 1`, `torch: 8`). A single
> scalar `maxPerItem` cannot express these per-item differences.
>
> **Required fix (choose one):**
> - Change `maxPerItem` from `number` to `Record<string, number>` in the
>   `ClickableItemGridProps` interface, and apply `maxPerItem[key]` in the click handler.
> - Keep `maxPerItem` as scalar but move the cap-checking logic into `ExpeditionLogForm`'s
>   own `onChange` handler, passing `PROVISION_MAX_STACK[key]` as the per-key ceiling
>   before updating state (and don't use `maxPerItem` at all for provisions).

---

## 📋 Checklist Audit

- **Phase 1:** Complete. All 3 items (schema relation, model fields, migration) are present.
- **Phase 2:** **Missing 1 item.** "Update `import` in `expedition.ts` to add
  `DungeonDifficulty, GameDifficulty, HeroClasses`" is absent from the checklist.
  This directly corresponds to Blocker 1.
- **Phase 3:** Complete. All 4 items (create file, GET, POST, response shapes) are present.
- **Phase 4:** Complete. All 6 `ClickableItemGrid` items are present.
- **Phase 5:** Complete. All sub-component items (StarRating, HeroSelector, CasualtySelector,
  ExpeditionLogForm sections 1–13, ExpeditionHistoryCard, ExpeditionHistoryList) are present.
- **Phase 6:** Complete. All 5 integration items are present.
- **Verification:** Complete. All manual test cases are listed.
- **Dependency order:** Correct. Schema → types → API → shared components → form →
  history → page. No circular dependencies.

---

## 💡 Suggestions

1. **Add the missing import checklist item (Blocker 1 fix).** Insert into Phase 2:
   `- [ ] Update expedition.ts import to include DungeonDifficulty, GameDifficulty, HeroClasses`

2. **Reset casualties when heroes change.** In `ExpeditionLogForm`, add a `useEffect`
   on `heroes` that filters `casualties` to only retain values still in `heroes`. Prevents
   stale casualties from being submitted.

3. **Guard provision pre-fill `useEffect`.** Mirror the existing page's pattern:
   only fetch inside a `if (dungeon && duration)` check so the effect doesn't fire on
   the initial undefined/default state before selections are made.

4. **Decide on loot images for `gold`.** `LOOT_STRINGS.gold` points to `Gold_1.png`
   (a coin pile image), while `GOLD_IMG_SRC.coin` also points to `Coin.png`. Both work,
   but verify the correct icon is used in the loot grid vs. just displaying a raw gold
   amount.

5. **Consider clearing loot and provisions when dungeon/duration changes.** If the user
   changes dungeon mid-form, provisions will auto-refill from the recommendation, but
   any loot the user already clicked will remain unchanged. Whether to reset loot on
   dungeon change is a UX decision worth making explicit before implementation.
