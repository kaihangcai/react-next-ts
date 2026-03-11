# Plan — 2026-03-01-expedition-journal

> Generated: 2026-03-01 00:00

## Objective

Extend the `/darkest/expedition` page into a full expedition journal where users can log runs with heroes, provisions, outcome, casualties, loot, stress notes, general notes, and a star rating.

## Approach

Add a Prisma `ExpeditionLog` model (JSON columns for arrays/objects), a new API route, shared UI components (ClickableItemGrid, StarRating, HeroSelector, CasualtySelector), full form + history list components, and wire everything into the existing expedition page via a three-tab layout.

## Accepted Plan

# Plan: Expedition Journal Feature (T2)

## Context

The Darkest Dungeon companion module currently only shows provision suggestions for
dungeon/duration combinations. The goal is to extend the `/darkest/expedition` page
into a full expedition journal where users can record entries after completing a run:
which heroes they brought, provisions taken, outcome, casualties, loot collected,
stress notes, general notes, and a 1–5 star rating.

User-facing entry points:
- **Recommendations** tab — existing functionality, unchanged
- **New Entry** tab — form to log an expedition
- **History** tab — list of past entries, newest first

All journal entries are per-user and private. The UI uses click-based interactions
(not text inputs) for loot and provision selection, matching the game's own feel.

---

## Phase 1 — Prisma Schema

**File:** `react-next-ts/prisma/schema.prisma`

Add `ExpeditionLog` model and the `expeditionLogs` relation to `User`:

```prisma
model User {
  // existing fields unchanged ...
  expeditionLogs ExpeditionLog[]   // ← ADD THIS LINE
}

model ExpeditionLog {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])

  dungeon        String           // Dungeon enum value (string)
  duration       String           // DungeonLength: 'short' | 'medium' | 'long'
  difficulty     Int              // DungeonDifficulty: 1 | 2 | 3
  gameDifficulty Int?             // GameDifficulty: 1 | 2 | 3 (optional)

  heroes         String           // JSON: HeroClasses[]
  provisions     String           // JSON: Provisions
  outcome        String           // ExpeditionOutcome value
  casualties     String           // JSON: HeroClasses[]
  loot           String           // JSON: Loot
  stressNotes    String
  notes          String
  rating         Int              // 1–5

  createdAt      DateTime @default(now())

  @@index([userId])
}
```

**Migration command** (run from `react-next-ts/`):
```
npx prisma migrate dev --name add-expedition-log
```

---

## Phase 2 — TypeScript Types

**File:** `react-next-ts/src/models/expedition.ts` (append to existing, keep all exports)

```typescript
export enum ExpeditionOutcome {
  SUCCESS = 'success',
  FAILURE = 'failure',
  RETREAT = 'retreat',
}

export interface ExpeditionLogEntry {
  id: string;
  userId: string;
  dungeon: Dungeon;
  duration: DungeonLength;
  difficulty: DungeonDifficulty;
  gameDifficulty?: GameDifficulty;
  heroes: HeroClasses[];
  provisions: Provisions;
  outcome: ExpeditionOutcome;
  casualties: HeroClasses[];
  loot: Loot;
  stressNotes: string;
  notes: string;
  rating: number;
  createdAt: string;
}

export interface CreateExpeditionLogDto {
  dungeon: Dungeon;
  duration: DungeonLength;
  difficulty: DungeonDifficulty;
  gameDifficulty?: GameDifficulty;
  heroes: HeroClasses[];
  provisions: Provisions;
  outcome: ExpeditionOutcome;
  casualties: HeroClasses[];
  loot: Loot;
  stressNotes: string;
  notes: string;
  rating: number;
}
```

Note: `Dungeon`, `DungeonLength`, `DungeonDifficulty`, `GameDifficulty`, `HeroClasses`
are already imported from `./darkest` at the top of this file; `Provisions` and `Loot`
are already defined in this file.

---

## Phase 3 — API Route

**File:** `react-next-ts/src/app/api/darkest/expedition/log/route.ts` (new)

Pattern mirrors `src/app/api/game/route.ts` exactly.

**GET** — returns authenticated user's logs, newest first:
```typescript
const session = await auth();
if (!session?.user?.id) return 401;
const logs = await prisma.expeditionLog.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: 'desc' },
});
// Parse JSON columns before returning
return NextResponse.json({ logs: parsed });
```

**POST** — creates a new log entry:
```typescript
const session = await auth();
if (!session?.user?.id) return 401;
// Validate: dungeon, duration, difficulty, outcome required;
//           heroes array 1–4; rating 1–5
await prisma.expeditionLog.create({
  data: {
    userId: session.user.id,
    // string/int fields stored directly
    // arrays/objects: JSON.stringify(body.field)
  },
});
return 201;
```

Response shapes:
- GET 200: `{ logs: ExpeditionLogEntry[] }`
- POST 201: `{ message: string, id: string }`
- 401: `{ message: "Unauthorized" }`
- 422: `{ message: "Validation failed", errors: Record<string, string> }`

---

## Phase 4 — Shared ClickableItemGrid Component

**File:** `react-next-ts/src/components/Darkest/ClickableItemGrid.tsx` (new)

This component is the key UX improvement: used for both **provisions** and **loot**
instead of text inputs. Users click item icons to increment counts, avoiding manual
number entry.

```typescript
interface ClickableItemGridProps {
  counts: Record<string, number>;          // current counts keyed by item name
  images: Record<string, string>;          // item name → image src
  labels: Record<string, string>;          // item name → display label
  maxPerItem?: number;                     // optional cap per item
  onChange: (key: string, delta: 1 | -1) => void;
}
```

**Behaviour:**
- Renders all items in a `grid grid-cols-4 gap-2 sm:grid-cols-6` layout
- Each cell: item image (32×32) with a count badge overlay (top-right corner)
  - Badge only visible when count > 0
  - Uses existing `ItemDisplay` badge style: `absolute top-0 right-0 text-xs font-bold text-white bg-cool-gray-100 rounded px-1`
- **Left-click** on image → `onChange(key, +1)`
- **Right-click** on image → `onChange(key, -1)`, `preventDefault()`
- Items with count=0 shown at `opacity-40`, count>0 at full opacity (provides feedback)
- Tooltip (HTML `title` attribute) shows the label for discoverability

Reuses: `PROVISION_IMG_SRC` (from `src/utils/Constants/image.ts`) for provisions,
`LOOT_STRINGS` (same file) for loot.

---

## Phase 5 — New Components

All new files under `react-next-ts/src/components/Darkest/`.

### `StarRating.tsx`

```typescript
interface StarRatingProps {
  value: number;           // 1–5
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}
```

- Renders 5 `Star` icons from lucide-react
- Filled stars: `fill="#F7BA50" color="#F7BA50"` (orange-30)
- Empty stars: `fill="transparent" color="#BBC5D0"` (cool-gray-20)
- Hover state: highlights stars up to hovered index
- Click calls `onChange(index + 1)`
- `readOnly` disables hover/click

### `HeroSelector.tsx`

```typescript
interface HeroSelectorProps {
  selected: HeroClasses[];
  onChange: (heroes: HeroClasses[]) => void;
  maxSelectable?: number;   // default 4
}
```

- Iterates `Object.entries(HeroClasses).filter(([, v]) => typeof v === 'number')`
  (avoids TypeScript numeric enum reverse-mapping duplicates)
- Hero name display: `key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())`
- Toggle buttons in `flex flex-wrap gap-2`
- Active: `border border-orange-30 text-orange-30 bg-cool-gray-90`
- Inactive: `border border-cool-gray-80 text-cool-gray-20`
- At max capacity: inactive unselected buttons get `opacity-40 cursor-not-allowed`

### `CasualtySelector.tsx`

```typescript
interface CasualtySelectorProps {
  heroes: HeroClasses[];       // only the selected heroes shown
  casualties: HeroClasses[];
  onChange: (casualties: HeroClasses[]) => void;
}
```

- Subset of `HeroSelector` — only renders heroes from `heroes` prop
- Active (dead) heroes show a `Skull` icon (lucide-react) + red text `text-red-400`
- If `heroes` is empty: `<p className="text-cool-gray-20 text-sm">Select heroes first.</p>`

### `ExpeditionLogForm.tsx`

The main form orchestrator. Props: `{ onSuccess: () => void }`.

**Internal state:** dungeon, duration, difficulty, gameDifficulty, heroes, provisions,
outcome, casualties, loot, stressNotes, notes, rating, isSubmitting, error.

**Provision pre-fill:** `useEffect` on `[dungeon, duration]` fetches
`/api/darkest/expedition/recommendations/${mapDungeonToIndex(dungeon)}`
and sets `provisions = data.provisions[duration]` — same logic as the existing page.
Uses `AbortController` to cancel in-flight requests on re-trigger.

**Form sections (top to bottom):**
1. Dungeon → reuse `DungeonSelector`
2. Duration → reuse `DurationSelector`
3. Difficulty → inline torch-button row (APPRENTICE / VETERAN / CHAMPION) matching `DurationSelector` styling
4. Game Difficulty → same pattern (RADIANT / DARKEST / STYGIAN), labelled "optional"
5. Heroes → `HeroSelector` (max 4)
6. Provisions → `ClickableItemGrid` with `PROVISION_IMG_SRC` images, pre-filled from recommendation; left-click +1, right-click -1; capped at `PROVISION_MAX_STACK` per item
7. Outcome → three styled buttons: SUCCESS (green border active), FAILURE (red), RETREAT (yellow)
8. Casualties → `CasualtySelector` (only rendered when `heroes.length > 0`)
9. Loot → `ClickableItemGrid` with `LOOT_STRINGS` images; left-click +1, right-click -1
10. Stress Notes → `<textarea className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded p-2 text-white text-sm" rows={3}>`
11. General Notes → same textarea pattern
12. Rating → `StarRating`
13. Submit → reuse existing `Button` component; disabled + "Saving…" text while `isSubmitting`

**Submit:** POST to `/api/darkest/expedition/log`. On success: call `onSuccess()`.
On error: display `error` message below the submit button.

### `ExpeditionHistoryCard.tsx`

```typescript
interface ExpeditionHistoryCardProps {
  entry: ExpeditionLogEntry;
}
```

Card layout `bg-cool-gray-90 rounded-lg p-4 border border-cool-gray-80`:
- **Header row:** dungeon name · difficulty label · duration · formatted date
- **Outcome badge:** SUCCESS = `text-green-400`, FAILURE = `text-red-400`, RETREAT = `text-orange-30`
- **Heroes row:** hero names, casualties shown with `Skull` icon + strikethrough
- **Loot row:** only non-zero loot items; renders each as its image (24×24) + count, using `LOOT_STRINGS`
- **Rating:** `StarRating` in `readOnly` mode
- **Notes:** `stressNotes` and `notes` in collapsible `<details>` if non-empty

### `ExpeditionHistoryList.tsx`

Self-fetching component (no props). Fetches `GET /api/darkest/expedition/log` on mount.

States: loading → `<p>Loading…</p>` | error → error message | empty → "No expeditions logged yet." | results → `entries.map(e => <ExpeditionHistoryCard key={e.id} entry={e} />)` in a `flex flex-col gap-4`.

---

## Phase 6 — Page Integration

**File:** `react-next-ts/src/app/(game)/darkest/expedition/page.tsx` (modify)

Add tab state at the top of the existing `"use client"` component:
```typescript
type TabId = 'recommendations' | 'new-entry' | 'history';
const [activeTab, setActiveTab] = useState<TabId>('recommendations');
```

Add tab bar above existing content:
```tsx
<div className="flex border-b border-cool-gray-80 mb-4">
  {(['recommendations', 'new-entry', 'history'] as TabId[]).map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-semibold transition-colors ${
        activeTab === tab
          ? 'border-b-2 border-orange-30 text-orange-30'
          : 'text-cool-gray-20 hover:text-white'
      }`}
    >
      {tab === 'new-entry' ? 'New Entry' : tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  ))}
</div>
```

Wrap existing selectors + recommendations in `{activeTab === 'recommendations' && ...}`.
Add:
```tsx
{activeTab === 'new-entry' && (
  <ExpeditionLogForm onSuccess={() => setActiveTab('history')} />
)}
{activeTab === 'history' && <ExpeditionHistoryList />}
```

After successful form submission, the tab automatically switches to 'history' so the
user immediately sees their new entry.

---

## File Manifest

| Action | Path |
|--------|------|
| MODIFY | `react-next-ts/prisma/schema.prisma` |
| MODIFY | `react-next-ts/src/models/expedition.ts` |
| CREATE | `react-next-ts/src/app/api/darkest/expedition/log/route.ts` |
| CREATE | `react-next-ts/src/components/Darkest/ClickableItemGrid.tsx` |
| CREATE | `react-next-ts/src/components/Darkest/StarRating.tsx` |
| CREATE | `react-next-ts/src/components/Darkest/HeroSelector.tsx` |
| CREATE | `react-next-ts/src/components/Darkest/CasualtySelector.tsx` |
| CREATE | `react-next-ts/src/components/Darkest/ExpeditionLogForm.tsx` |
| CREATE | `react-next-ts/src/components/Darkest/ExpeditionHistoryCard.tsx` |
| CREATE | `react-next-ts/src/components/Darkest/ExpeditionHistoryList.tsx` |
| MODIFY | `react-next-ts/src/app/(game)/darkest/expedition/page.tsx` |

---

## Implementation Order

1. Schema → migrate
2. `src/models/expedition.ts` — new types
3. `src/app/api/darkest/expedition/log/route.ts` — API
4. `ClickableItemGrid.tsx` — shared base (no dependencies beyond existing utils)
5. `StarRating.tsx`
6. `HeroSelector.tsx`
7. `CasualtySelector.tsx`
8. `ExpeditionLogForm.tsx` (depends on all above + DungeonSelector, DurationSelector)
9. `ExpeditionHistoryCard.tsx` (depends on StarRating, ExpeditionLogEntry type)
10. `ExpeditionHistoryList.tsx` (depends on ExpeditionHistoryCard)
11. `expedition/page.tsx` — wire tabs

---

## Verification

1. `npx prisma migrate dev --name add-expedition-log` — confirms schema valid, DB updated
2. `npm run build` — zero TypeScript errors
3. Manual test flow:
   - Navigate to `/darkest/expedition` → three tabs visible
   - Recommendations tab → existing functionality unchanged
   - New Entry tab → selecting dungeon + duration pre-fills provisions in the grid
   - Click provision items (left-click = +1, right-click = -1); opacity feedback correct
   - Click loot items similarly; only non-zero items appear in history card
   - Select heroes → casualties selector populates correctly
   - Submit form → redirects to History tab; new entry card appears at top
   - History tab → shows correct dungeon, outcome badge color, hero casualties, loot, rating
   - `GET /api/darkest/expedition/log` returns entries only for logged-in user
   - Unauthenticated POST returns 401
