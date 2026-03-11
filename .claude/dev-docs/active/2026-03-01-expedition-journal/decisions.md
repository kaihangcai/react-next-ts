# Key Files & Decisions — 2026-03-01-expedition-journal

> Last Updated: 2026-03-01 17:30

## Key Files

| File | Change |
|------|--------|
| `react-next-ts/prisma/schema.prisma` | Add `ExpeditionLog` model + `expeditionLogs` relation on `User` |
| `react-next-ts/src/models/expedition.ts` | Append `ExpeditionOutcome` enum, `ExpeditionLogEntry` and `CreateExpeditionLogDto` interfaces |
| `react-next-ts/src/app/api/darkest/expedition/log/route.ts` | New — GET (list logs) + POST (create log) |
| `react-next-ts/src/components/Darkest/ClickableItemGrid.tsx` | New — shared click-to-increment grid for provisions and loot |
| `react-next-ts/src/components/Darkest/StarRating.tsx` | New — 1–5 star rating, read-only and interactive modes |
| `react-next-ts/src/components/Darkest/HeroSelector.tsx` | New — toggle buttons for selecting up to 4 heroes |
| `react-next-ts/src/components/Darkest/CasualtySelector.tsx` | New — subset of hero selector, marks heroes as casualties |
| `react-next-ts/src/components/Darkest/ExpeditionLogForm.tsx` | New — full form orchestrator with provision pre-fill |
| `react-next-ts/src/components/Darkest/ExpeditionHistoryCard.tsx` | New — single entry display card |
| `react-next-ts/src/components/Darkest/ExpeditionHistoryList.tsx` | New — self-fetching list of history cards |
| `react-next-ts/src/app/(game)/darkest/expedition/page.tsx` | Restructured: GameSaveSelector + two tabs (History / Heroes); recommendations and new-entry removed |
| `react-next-ts/src/components/UI/Button.tsx` | Extended with `disabled?: boolean` prop (not in original plan — added to fix Blocker 2) |
| `react-next-ts/src/app/(game)/darkest/expedition/recommendations/page.tsx` | New — recommendations logic extracted from expedition/page.tsx into its own page |
| `react-next-ts/src/app/(game)/darkest/expedition/new/page.tsx` | New — dedicated page for creating a log entry (replaces the "New Entry" tab) |
| `react-next-ts/src/app/api/darkest/expedition/saves/route.ts` | New — GET/POST for game saves |
| `react-next-ts/src/app/api/darkest/expedition/saves/[id]/route.ts` | New — PATCH/DELETE for a specific game save |
| `react-next-ts/src/app/api/darkest/expedition/roster/route.ts` | New — GET/POST for roster heroes scoped to a save |
| `react-next-ts/src/app/api/darkest/expedition/roster/[id]/route.ts` | New — PATCH/DELETE for a specific roster hero |
| `react-next-ts/src/components/Darkest/GameSaveSelector.tsx` | New — slot 1–3 save picker with inline create flow |
| `react-next-ts/src/components/Darkest/RosterHeroCard.tsx` | New — hero roster entry display card |
| `react-next-ts/src/components/Darkest/RosterHeroForm.tsx` | New — add/edit hero form with tag inputs for quirks |
| `react-next-ts/src/components/Darkest/RosterHeroList.tsx` | New — self-fetching roster list for a save |

## Architectural Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| JSON columns for arrays/objects (`heroes`, `provisions`, `casualties`, `loot`) | SQLite has no array type; keeps schema simple | Must parse on read; no individual column queries |
| `ClickableItemGrid` shared for both provisions and loot | Avoids duplication; same left/right-click UX | Slightly more generic props surface |
| Self-fetching `ExpeditionHistoryList` | Keeps page.tsx clean; encapsulates loading/error state | Harder to unit-test in isolation |
| Provision pre-fill via existing recommendations API | Reuses existing logic; no duplication | Requires extra fetch on dungeon/duration change |
| Tab state in `page.tsx`, not URL | Simpler; avoids router push for in-page transitions | Deep-linking to a specific tab is not supported |
| `auth()` guard in API route returning 401 | Consistent with existing route patterns | — |
| Extend `Button` with `disabled?: boolean` (or use raw `<button>` for submit) | `Button` component has no `disabled` prop; plan assumed it did — compile error if not fixed | Extending Button is the cleaner path; raw `<button>` avoids touching a shared component |
| `ClickableItemGrid.maxPerItem` typed as `Record<string, number>` instead of `number` | `PROVISION_MAX_STACK` is per-item (food=12, fireWood=1, torch=8) — a scalar can't express this | Slightly broader prop type; consumer must pass the full map |
| `GameSave` as the ownership boundary for logs and roster | Matches DD's actual 3-save-slot structure; scopes all journal data per playthrough rather than per user account | Extra join to verify auth (save → user); slightly more complex queries |
| Auth on roster/log routes via `GameSave` lookup instead of direct `userId` | `ExpeditionLog` no longer has `userId`; ownership verified by checking `gameSave.userId === session.user.id` | Cannot query logs directly by userId without joining through saves |
| Recommendations extracted to `/darkest/expedition/recommendations/page.tsx` | Wiki-style content (Recommendations, Heroes, Enemies, Curios) is conceptually separate from personal journal; keeps expedition page focused | Existing navigation/links to `/darkest/expedition` for recommendations must be updated |
| New Entry as a dedicated page (`/darkest/expedition/new`) not a tab | Cleaner History tab (just a list + button); form gets full page real-estate; navigable URL | Requires `router.push` for redirect on success rather than tab state change |
| Hero roster uses freeform text for quirks, diseases, and trinkets | The game has hundreds of quirks and trinkets; a rigid enum would go stale and is unnecessarily complex | No validation of quirk/trinket names; user is trusted to enter correct data |
| Tag-style input for quirks/diseases (type + Enter = add, click = remove) | More natural than a textarea for list-valued fields; renders cleanly as coloured chips | Requires a small custom tag-input pattern (no external library needed) |

## Deviations from Plan

### Post-review corrections (2026-03-01)

- **Blocker 1 — `expedition.ts` import gap:** The plan stated that `DungeonDifficulty`,
  `GameDifficulty`, and `HeroClasses` were "already imported" from `./darkest`. They are
  not — only `Dungeon` and `DungeonLength` are imported. A new checklist item has been
  added to Phase 2 to update the import before appending the new types.

- **Blocker 2 — `Button` has no `disabled` prop:** The plan called for `<Button disabled>`
  on the form submit. The `Button` component (`src/components/UI/Button.tsx`) only accepts
  `label`, `onClick`, and `className`. Either extend `Button` with `disabled?: boolean` or
  use a raw `<button>` element in the form. Checklist item updated with both options.

- **Blocker 3 — `ClickableItemGrid.maxPerItem` type changed:** Plan defined `maxPerItem`
  as `number` (single scalar). `PROVISION_MAX_STACK` is `Record<keyof Provisions, number>`
  with different caps per item. `maxPerItem` must be `Record<string, number>` so the grid
  can apply `maxPerItem[key]` per cell. Checklist item added to Phase 4.

- **Button default class updated:** Added `disabled:opacity-40 disabled:cursor-not-allowed`
  to `Button`'s default `className` string so the disabled state is visually reflected
  without callers needing to pass a custom class.

- **EPERM on `prisma generate` (Windows):** The dev server holds a file lock on
  `query_engine-windows.dll.node`, preventing `prisma generate` from completing. The
  migration itself applied successfully. **To run `npm run build`, stop the dev server
  first**, then run `npx prisma generate && npm run build`.

### Phase 1b–6b implementation (2026-03-01)

- **ESLint error — unescaped quotes in `RosterHeroCard.tsx`:** The custom name display
  used literal `"` characters in JSX text (`"{hero.customName}"`). Next.js ESLint rules
  require these to be escaped. Fixed by replacing with `&ldquo;` and `&rdquo;` HTML
  entities. Build passed cleanly after this fix.

- **Cascade deletes implemented manually:** SQLite Prisma does not enforce cascading
  deletes by default without `onDelete: Cascade` in the schema. Rather than adding
  `onDelete` to the schema (which would require a new migration), the DELETE handler in
  `saves/[id]/route.ts` explicitly deletes `expeditionLogs` and `rosterHeroes` before
  deleting the `GameSave`.

- **`new/page.tsx` uses `Suspense` wrapper:** `useSearchParams()` in Next.js 15 requires
  the component to be wrapped in `<Suspense>` to avoid a build-time static rendering
  error. The page exports a `Suspense`-wrapped shell component with the inner logic in a
  separate `NewExpeditionPageInner` component.
