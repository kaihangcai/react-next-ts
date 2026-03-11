# Task Checklist — 2026-03-01-expedition-journal

> Last Updated: 2026-03-01 17:30
> Status: Active

## Phase 1 — Prisma Schema

- [x] Add `expeditionLogs ExpeditionLog[]` relation to `User` model in `schema.prisma`
- [x] Add `ExpeditionLog` model with all fields (`id`, `userId`, `dungeon`, `duration`, `difficulty`, `gameDifficulty`, `heroes`, `provisions`, `outcome`, `casualties`, `loot`, `stressNotes`, `notes`, `rating`, `createdAt`, `@@index([userId])`) *(revised: replaced `userId` with `gameSaveId` — see Phase 1b)*
- [x] Run `npx prisma migrate dev --name add-expedition-log` from `react-next-ts/`

## Phase 1b — Schema Extension: Game Saves + Roster *(new scope)*

- [x] Add `gameSaves GameSave[]` relation to `User` model
- [x] Add `GameSave` model (`id`, `userId`, `user`, `slot Int` 1–3, `name String`, `expeditionLogs`, `rosterHeroes`, `createdAt`; `@@unique([userId, slot])`, `@@index([userId])`)
- [x] Add `rosterHeroes RosterHero[]` relation to `GameSave` model
- [x] Add `RosterHero` model (`id`, `gameSaveId`, `gameSave`, `heroClass Int`, `customName String`, `level Int`, `positiveQuirks String` JSON, `negativeQuirks String` JSON, `diseases String` JSON, `trinket1 String`, `trinket2 String`, `notes String`, `createdAt`, `updatedAt @updatedAt`; `@@index([gameSaveId])`)
- [x] Revise `ExpeditionLog` model: replace `userId String` + direct `User` relation with `gameSaveId String` + `GameSave` relation; update `@@index` to `[gameSaveId]`
- [x] Run new migration `npx prisma migrate dev --name add-game-save-roster`

## Phase 2 — TypeScript Types

- [x] Update `import` in `expedition.ts` to add `DungeonDifficulty`, `GameDifficulty`, `HeroClasses` from `./darkest`
- [x] Append `ExpeditionOutcome` enum to `react-next-ts/src/models/expedition.ts`
- [x] Append `ExpeditionLogEntry` interface to `react-next-ts/src/models/expedition.ts` *(revised: `userId` → `gameSaveId`)*
- [x] Append `CreateExpeditionLogDto` interface to `react-next-ts/src/models/expedition.ts`

## Phase 2b — Type Extension: Game Saves + Roster *(new scope)*

- [x] Append `GameSave` interface (`id`, `userId`, `slot: 1 | 2 | 3`, `name`, `createdAt`)
- [x] Append `CreateGameSaveDto` interface (`slot: 1 | 2 | 3`, `name`)
- [x] Append `RosterHero` interface (`id`, `gameSaveId`, `heroClass: HeroClasses`, `customName`, `level`, `positiveQuirks: string[]`, `negativeQuirks: string[]`, `diseases: string[]`, `trinket1`, `trinket2`, `notes`, `createdAt`, `updatedAt`)
- [x] Append `CreateRosterHeroDto` and `UpdateRosterHeroDto` interfaces
- [x] Update `ExpeditionLogEntry.userId` → `gameSaveId: string` in `expedition.ts`
- [x] Update `CreateExpeditionLogDto` to include `gameSaveId: string`

## Phase 3 — API Route

- [x] Create `react-next-ts/src/app/api/darkest/expedition/log/route.ts`
- [x] Implement GET handler (auth guard, findMany ordered by createdAt desc, parse JSON columns) *(revised: filters by gameSaveId, verifies save belongs to user)*
- [x] Implement POST handler (auth guard, validation, create with JSON.stringify for array/object fields) *(revised: accepts gameSaveId, verifies ownership via GameSave lookup)*
- [x] Return correct response shapes (200 / 201 / 401 / 422)

## Phase 3b — API Extension: Game Saves + Roster *(new scope)*

- [x] Create `react-next-ts/src/app/api/darkest/expedition/saves/route.ts`
- [x] Implement GET handler: return all saves for authenticated user (ordered by slot)
- [x] Implement POST handler: create a save (validate slot 1–3, unique per user; validate name non-empty)
- [x] Create `react-next-ts/src/app/api/darkest/expedition/saves/[id]/route.ts`
- [x] Implement PATCH handler: update save name (auth guard, confirm ownership)
- [x] Implement DELETE handler: delete save + cascade logs + roster (auth guard, confirm ownership)
- [x] Create `react-next-ts/src/app/api/darkest/expedition/roster/route.ts`
- [x] Implement GET handler: return all roster heroes for a save (`?saveId=` query param; verify ownership)
- [x] Implement POST handler: add a hero to roster (validate heroClass, level 0–6; verify save ownership)
- [x] Create `react-next-ts/src/app/api/darkest/expedition/roster/[id]/route.ts`
- [x] Implement PATCH handler: update roster hero fields (auth guard via save ownership)
- [x] Implement DELETE handler: remove hero from roster (auth guard via save ownership)
- [x] Revise `log/route.ts` GET: accept `?saveId=` query param, verify save ownership, filter by gameSaveId
- [x] Revise `log/route.ts` POST: accept `gameSaveId` in body, verify ownership, store against gameSaveId

## Phase 4 — ClickableItemGrid Component

- [x] Create `react-next-ts/src/components/Darkest/ClickableItemGrid.tsx`
- [x] Define `maxPerItem` prop as `Record<string, number>`
- [x] Implement grid layout (`grid grid-cols-4 gap-2 sm:grid-cols-6`)
- [x] Implement count badge overlay (visible only when count > 0)
- [x] Implement left-click (+1) and right-click (-1, preventDefault) handlers
- [x] Implement opacity feedback (count=0 → `opacity-40`, count>0 → full opacity)
- [x] Add `title` tooltip with item label

## Phase 5 — New Components

### StarRating.tsx
- [x] Create `react-next-ts/src/components/Darkest/StarRating.tsx`
- [x] Render 5 Star icons (lucide-react) with filled/empty states
- [x] Implement hover state (highlights up to hovered index)
- [x] Implement click handler calling `onChange(index + 1)`
- [x] Implement `readOnly` prop (disables hover/click)

### HeroSelector.tsx
- [x] Create `react-next-ts/src/components/Darkest/HeroSelector.tsx`
- [x] Iterate numeric `HeroClasses` enum entries (filter out reverse-mapping strings)
- [x] Format hero names (snake_case → Title Case)
- [x] Implement toggle buttons with active/inactive styles
- [x] Implement max-capacity guard (`opacity-40 cursor-not-allowed` on unselected at max)

### CasualtySelector.tsx
- [x] Create `react-next-ts/src/components/Darkest/CasualtySelector.tsx`
- [x] Render only heroes from `heroes` prop
- [x] Show `Skull` icon + `text-red-400` for active (dead) heroes
- [x] Show "Select heroes first." when `heroes` prop is empty

### ExpeditionLogForm.tsx
- [x] Create `react-next-ts/src/components/Darkest/ExpeditionLogForm.tsx`
- [x] Set up all internal state fields
- [x] Section 1–13: all form sections implemented
- [x] Provision pre-fill `useEffect` with AbortController + `if (dungeon && duration)` guard
- [x] `useEffect` to filter stale casualties on hero change
- [x] POST to `/api/darkest/expedition/log` on submit
- [x] Call `onSuccess()` on 201 response; display error on failure
- [x] Revise: accept `gameSaveId` prop and include it in POST body

### ExpeditionHistoryCard.tsx
- [x] Create `react-next-ts/src/components/Darkest/ExpeditionHistoryCard.tsx`
- [x] Header row, outcome badge, heroes row, loot row, StarRating, collapsible notes

### ExpeditionHistoryList.tsx
- [x] Create `react-next-ts/src/components/Darkest/ExpeditionHistoryList.tsx`
- [x] Fetch, loading/error/empty/results states, card list
- [x] Revise: accept `gameSaveId` prop; pass as `?saveId=` query param to GET
- [x] Add `+ New Entry` button in header row that calls `router.push('/darkest/expedition/new')`

## Phase 5b — New Components: Game Save Selector + Roster *(new scope)*

### GameSaveSelector.tsx
- [x] Create `react-next-ts/src/components/Darkest/GameSaveSelector.tsx`
- [x] Self-fetch saves on mount from `GET /api/darkest/expedition/saves`
- [x] Display slots 1–3: filled slots show slot number + user label; empty slots show "Create Save"
- [x] Clicking a filled slot selects it (highlighted with `border-orange-30`)
- [x] Clicking an empty slot opens an inline create form (name input + confirm button)
- [x] Emit `onSaveSelected(saveId: string)` when a save is selected or created
- [x] Handle loading / error states

### RosterHeroCard.tsx
- [x] Create `react-next-ts/src/components/Darkest/RosterHeroCard.tsx`
- [x] Card layout matching `ExpeditionHistoryCard` style (`bg-cool-gray-90 rounded-lg p-4 border border-cool-gray-80`)
- [x] Header: hero class name + optional custom name + resolve level badge
- [x] Quirks section: positive quirks (green tags), negative quirks (red tags), diseases (yellow tags)
- [x] Trinkets section: trinket 1 and trinket 2 labels (or "— empty —" if blank)
- [x] Notes: collapsible `<details>` if non-empty
- [x] Edit button that switches card to edit mode (or calls `onEdit` prop)
- [x] Delete button with confirmation prompt

### RosterHeroForm.tsx
- [x] Create `react-next-ts/src/components/Darkest/RosterHeroForm.tsx`
- [x] Props: `gameSaveId: string`, `hero?: RosterHero` (undefined = create mode), `onSuccess: () => void`, `onCancel: () => void`
- [x] Hero class selector (reuse `HeroSelector` in single-select mode, maxSelectable=1)
- [x] Optional custom name text input
- [x] Resolve level selector (0–6, displayed as rank labels: Novice/Apprentice/Journeyman/Veteran/Heroic/Forsaken/Stygian)
- [x] Positive quirks: tag-style input (type and press Enter to add, click tag to remove)
- [x] Negative quirks: same pattern, tags shown in red
- [x] Diseases: same pattern, tags shown in yellow
- [x] Trinket 1 and Trinket 2 text inputs
- [x] Notes textarea
- [x] Submit button (POST for create, PATCH for edit); Cancel button calls `onCancel`

### RosterHeroList.tsx
- [x] Create `react-next-ts/src/components/Darkest/RosterHeroList.tsx`
- [x] Props: `gameSaveId: string`
- [x] Fetch `GET /api/darkest/expedition/roster?saveId=<gameSaveId>` on mount and on `gameSaveId` change
- [x] Handle loading / error / empty ("No heroes on roster yet.") / results states
- [x] Render `RosterHeroCard` list in `flex flex-col gap-4`
- [x] Show `+ Add Hero` button above list; clicking it shows `RosterHeroForm` in create mode
- [x] On form success: refetch roster list; hide form

## Phase 6 — Page Integration *(original — superseded, see Phase 6b)*

- [x] Add `TabId` type and `activeTab` state *(superseded: tabs changed — see Phase 6b)*
- [x] Add tab bar (Recommendations / New Entry / History) *(superseded: Recommendations removed, New Entry removed as tab)*
- [x] Wrap existing recommendations content *(superseded: recommendations moves to its own page)*
- [x] Add New Entry tab content *(superseded: New Entry becomes its own page)*
- [x] Add History tab content *(still valid, revised in Phase 6b)*

## Phase 6b — Page Restructure *(new scope)*

### Recommendations extraction
- [x] Create `react-next-ts/src/app/(game)/darkest/expedition/recommendations/page.tsx`
- [x] Move all recommendations logic (state, handlers, `useEffect`, render) from `expedition/page.tsx` into the new page
- [x] Remove recommendations-related code and imports from `expedition/page.tsx`

### New Entry dedicated page
- [x] Create `react-next-ts/src/app/(game)/darkest/expedition/new/page.tsx`
- [x] Render `ExpeditionLogForm` with `gameSaveId` passed from `searchParams` (e.g. `?saveId=...`)
- [x] On form success: `router.push('/darkest/expedition')`
- [x] Include a "← Back" link to `/darkest/expedition`

### Expedition page restructure
- [x] Replace `TabId` with `"history" | "heroes"` (remove `"recommendations"` and `"new-entry"`)
- [x] Set default `activeTab` to `"history"`
- [x] Add `GameSaveSelector` above the tab bar; store selected `saveId` in state
- [x] Gate tab content behind save selection (show prompt if no save selected yet)
- [x] History tab: render `ExpeditionHistoryList` with `gameSaveId` prop
- [x] Heroes tab: render `RosterHeroList` with `gameSaveId` prop
- [x] Remove all recommendations-related state and logic from this file

## Verification

- [x] `npx prisma migrate dev` (initial) completes without errors
- [x] `npm run build` — zero TypeScript errors *(pre-existing warnings only)*
- [x] New migration `add-game-save-roster` applies without errors
- [x] `npm run build` passes after all Phase 1b–6b changes
- [ ] Save selector visible on `/darkest/expedition`; slot 1–3 shown; create save flow works
- [ ] Selecting a save loads history and roster tabs scoped to that save
- [ ] History tab default; `+ New Entry` button navigates to `/darkest/expedition/new`
- [ ] New entry form at `/darkest/expedition/new` pre-fills provisions; submits and redirects back
- [ ] History tab after redirect shows new entry at top
- [ ] Heroes tab: add hero form works; card shows quirks/trinkets correctly
- [ ] Edit and delete roster hero works
- [ ] `/darkest/expedition/recommendations` shows existing recommendations functionality unchanged
- [ ] Logs and roster from save A are not visible when save B is selected
- [ ] Unauthenticated requests to saves/roster/log APIs return 401
