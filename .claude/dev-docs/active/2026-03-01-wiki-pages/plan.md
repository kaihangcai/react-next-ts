# Plan — 2026-03-01-wiki-pages

> Generated: 2026-03-01 00:00

## Objective

Turn the three empty sidebar placeholder pages (Heroes, Enemies, Curios) into wiki-style reference pages with a card grid, configurable columns selector, and a modal detail view, backed by static TypeScript data files.

## Approach

Create shared UI components (Modal, WikiGrid, WikiCard), define TypeScript interfaces in a new `wiki.ts` model, populate three static data files, then wire each page with its own modal content component — no database or API routes required.

## Accepted Plan

# Plan: Heroes / Enemies / Curios Wiki Pages

## Context

The three sidebar links (Heroes, Enemies, Curios) currently resolve to empty placeholder
pages. The goal is to turn each into a wiki-style reference page: a grid of unit cards
with a configurable columns-per-row selector (3 / 5 / 10, default 5), where clicking any
card opens a modal with full details. Data is stored as static TypeScript files in
`src/data/` — no database or API routes required. Image slots are reserved (placeholder
shown) so real images can be dropped in later without layout changes.

---

## File Manifest

| Action | Path |
|--------|------|
| CREATE | `src/models/wiki.ts` |
| CREATE | `src/data/heroes.ts` |
| CREATE | `src/data/enemies.ts` |
| CREATE | `src/data/curios.ts` |
| CREATE | `src/components/UI/Modal.tsx` |
| CREATE | `src/components/Darkest/WikiGrid.tsx` |
| CREATE | `src/components/Darkest/WikiCard.tsx` |
| MODIFY | `src/app/(game)/darkest/heroes/page.tsx` |
| MODIFY | `src/app/(game)/darkest/enemies/page.tsx` |
| MODIFY | `src/app/(game)/darkest/curios/page.tsx` |

---

## Phase 1 — `src/models/wiki.ts`

Imports `HeroClasses` and `Dungeon` from `./darkest`.

```typescript
import { Dungeon, HeroClasses } from './darkest';

export interface WikiTag {
    label: string;
    color?: string; // Tailwind text-color class, e.g. "text-orange-30"
}

export type CombatStyle = 'Melee' | 'Ranged' | 'Support' | 'Hybrid';

export interface HeroAbility {
    name: string;
    description: string;
}

export interface HeroEntry {
    heroClass: HeroClasses;
    name: string;
    combatStyle: CombatStyle;
    positions: number[];         // attacking positions (1 = front, 4 = back)
    bestDungeons: Dungeon[];
    description: string;
    abilities: HeroAbility[];
    imagePath?: string;
    tags: WikiTag[];             // max 3, pre-computed
}

export type EnemyType = 'Undead' | 'Beast' | 'Eldritch' | 'Human' | 'Unholy';

export interface EnemyAbility {
    name: string;
    description: string;
}

export interface EnemyEntry {
    id: string;                  // kebab-case slug, used as React key
    name: string;
    dungeons: Dungeon[];
    enemyType: EnemyType;
    combatStyle: 'Melee' | 'Ranged' | 'Support';
    ranks: number[];             // positions this enemy occupies (1 = front)
    description: string;
    abilities: EnemyAbility[];
    tips: string[];
    imagePath?: string;
    tags: WikiTag[];
}

export interface CurioItemInteraction {
    item: string;                // e.g. "Holy Water", "Skeleton Key"
    result: string;
}

export interface CurioEntry {
    id: string;
    name: string;
    dungeons: Dungeon[];         // empty = all dungeons
    description: string;
    baseEffect: string;
    baseOutcome: 'positive' | 'negative' | 'variable';
    itemInteractions: CurioItemInteraction[];
    imagePath?: string;
    tags: WikiTag[];
}
```

`tags` are pre-computed on each data object so `WikiCard` stays purely presentational
with no knowledge of the data type.

---

## Phase 2 — `src/components/UI/Modal.tsx`

Generic reusable overlay modal.

**Props:** `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: React.ReactNode`

**Behaviour:**
- `return null` when `!isOpen` (clean DOM, no child effects)
- ESC → close via `window.addEventListener('keydown', ...)` in `useEffect`
- Scroll lock: `document.body.style.overflow = 'hidden'` when open; cleared on close/unmount
- Backdrop click closes; `e.stopPropagation()` on panel prevents bubble

**Layout classes:**
```
Backdrop:  "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
Panel:     "bg-cool-gray-90 border border-cool-gray-80 rounded-lg p-6
            max-w-2xl w-full max-h-[80vh] overflow-y-auto"
Header:    "flex items-center justify-between mb-4"
Title:     "text-white font-bold text-xl"
Close btn: <X size={18} /> from lucide-react (already a dependency)
           "text-cool-gray-20 hover:text-white transition-colors"
```

---

## Phase 3 — `src/components/Darkest/WikiGrid.tsx`

Grid wrapper with columns-per-row selector.

**Props:** `columns: 3 | 5 | 10`, `onColumnsChange: (c: 3 | 5 | 10) => void`, `children: React.ReactNode`

**Critical — static Tailwind class map** (dynamic string construction would be purged by Tailwind's scanner):
```typescript
const COLS_CLASS: Record<3 | 5 | 10, string> = {
    3:  'grid-cols-3',
    5:  'grid-cols-5',
    10: 'grid-cols-10',
};
```

**Selector buttons:** `[3] [5] [10]`
- Active:   `border-orange-30 text-orange-30 bg-cool-gray-90`
- Inactive: `border-cool-gray-80 text-cool-gray-20 hover:border-orange-30 hover:text-orange-30`

**Grid container:** `grid gap-3 ${COLS_CLASS[columns]}`

---

## Phase 4 — `src/components/Darkest/WikiCard.tsx`

**Props:** `name: string`, `imagePath?: string`, `tags: WikiTag[]`, `onClick: () => void`

**Layout (top to bottom inside card):**

1. **Image area** — `relative aspect-square w-full rounded bg-cool-gray-80 overflow-hidden mb-2`
   - If `imagePath`: `<Image src={imagePath} alt={name} fill className="object-contain" />`
   - Else: centered initial letter `text-2xl font-bold text-cool-gray-20`
2. **Name** — `text-white text-sm font-semibold text-center truncate`
3. **Tags row** — `flex flex-wrap justify-center gap-1 mt-1`
   - Each tag: `text-xs px-1.5 py-0.5 rounded bg-cool-gray-80 {tag.color ?? 'text-cool-gray-20'}`

**Card wrapper:**
`bg-cool-gray-90 rounded-lg p-2 border border-cool-gray-80 cursor-pointer hover:border-orange-30 transition-colors`

---

## Phase 5 — Static Data Files

### `src/data/heroes.ts` — all 18 `HeroEntry` objects

**Tag colour conventions:**
- Melee → `text-orange-30`
- Ranged → `text-blue-300`
- Support → `text-green-300`
- Hybrid → `text-purple-300`
- Dungeon / trait names → `text-cool-gray-20`

All 18 heroes from `HeroClasses` enum included:

| Hero | Style | Positions | Notable trait |
|------|-------|-----------|--------------|
| Abomination | Hybrid | 1–2 | Transform mechanic |
| Antiquarian | Support | 3–4 | Gold find bonus |
| Arbalest | Ranged | 3–4 | Mark + heal |
| Bounty Hunter | Melee | 2–3 | Mark removal + stun |
| Crusader | Melee | 1–2 | Anti-undead |
| Grave Robber | Ranged | 2–3 | Flexible positions |
| Hellion | Melee | 1 | Bleed + self-buff |
| Highwayman | Hybrid | 2–3 | Riposte |
| Houndmaster | Support | 3–4 | Mark + guard |
| Jester | Support | 2–3 | Stress heal |
| Leper | Melee | 1 | Highest base damage |
| Man-at-Arms | Melee | 1–2 | Guard + party buffs |
| Musketeer | Ranged | 3–4 | Mark + healing |
| Occultist | Support | 3–4 | Mark + risky heal |
| Plague Doctor | Support | 3–4 | Blight + stun |
| Vestal | Support | 3–4 | Healing + anti-undead |
| Flagellant | Melee | 1–2 | Bleed + self-harm |
| Shieldbreaker | Melee | 1–3 | Pyre + stun |

### `src/data/enemies.ts` — 6 `EnemyEntry` samples across dungeons

| id | Name | Dungeon | Type | Style |
|----|------|---------|------|-------|
| `bone-soldier` | Bone Soldier | Ruins | Undead | Melee |
| `gargoyle` | Gargoyle | Ruins | Unholy | Melee |
| `swine-slasher` | Swine Slasher | Warrens | Beast | Melee |
| `fungal-scrub` | Fungal Scrub | Weald | Eldritch | Ranged |
| `drowned-crew` | Drowned Crew | Cove | Undead | Melee |
| `cultist-brawler` | Cultist Brawler | Farmstead | Human | Melee |

**Type tag colours:** Undead `text-cool-gray-20`, Beast `text-green-300`,
Eldritch `text-purple-300`, Human `text-blue-300`, Unholy `text-yellow-400`

### `src/data/curios.ts` — 8 `CurioEntry` samples

| id | Name | Dungeons | Best item |
|----|------|----------|-----------|
| `eldritch-altar` | Eldritch Altar | Cove | Holy Water |
| `locked-strongbox` | Locked Strongbox | All | Skeleton Key |
| `moonshine-barrel` | Moonshine Barrel | Weald | Shovel |
| `pile-of-bones` | Pile of Bones | Ruins | Holy Water |
| `mouldy-tome` | Mouldy Tome | All | Torch |
| `torture-rack` | Torture Rack | Warrens, Weald | Medicinal Herbs |
| `shallow-grave` | Shallow Grave | Weald | Shovel |
| `bas-relief` | Bas-Relief | Ruins | Holy Water |

**Outcome tag colours:** positive `text-green-300`, negative `text-red-400`,
variable `text-yellow-400`

---

## Phase 6 — Page Files

All three pages share the same structure. Heroes page as representative example:

```typescript
"use client"
import { useState } from 'react';
import { HEROES } from '@/data/heroes';
import { HeroEntry } from '@/models/wiki';
import WikiGrid from '@/components/Darkest/WikiGrid';
import WikiCard from '@/components/Darkest/WikiCard';
import Modal from '@/components/UI/Modal';

type ColCount = 3 | 5 | 10;

const HeroesPage = () => {
    const [columns, setColumns] = useState<ColCount>(5);
    const [selected, setSelected] = useState<HeroEntry | null>(null);

    return (
        <div className="flex flex-col p-2">
            <h1 className="font-bold text-xl mb-4">HEROES</h1>
            <WikiGrid columns={columns} onColumnsChange={setColumns}>
                {HEROES.map(hero => (
                    <WikiCard
                        key={hero.heroClass}
                        name={hero.name}
                        imagePath={hero.imagePath}
                        tags={hero.tags}
                        onClick={() => setSelected(hero)}
                    />
                ))}
            </WikiGrid>
            <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
                {selected && <HeroModalContent hero={selected} />}
            </Modal>
        </div>
    );
};
```

**`HeroModalContent`** (defined in same file):
- Image placeholder / `<Image>` if `imagePath`
- Combat style + positions row (badge chips)
- `description` paragraph
- **Best Dungeons** row
- **Abilities** list — each entry: `<span className="font-semibold text-orange-30">{name}</span>` + description

**`EnemyModalContent`:** type + ranks + dungeons badges, description, abilities list, tips list

**`CurioModalContent`:** dungeon badges, `baseEffect` paragraph (color-coded by `baseOutcome`), item interactions as rows: item name → result

---

## Implementation Order

1. `src/models/wiki.ts`
2. `src/components/UI/Modal.tsx`
3. `src/components/Darkest/WikiGrid.tsx`
4. `src/components/Darkest/WikiCard.tsx`
5. `src/data/heroes.ts`
6. `src/data/enemies.ts`
7. `src/data/curios.ts`
8. `src/app/(game)/darkest/heroes/page.tsx`
9. `src/app/(game)/darkest/enemies/page.tsx`
10. `src/app/(game)/darkest/curios/page.tsx`

---

## Verification

1. `npm run build` — zero TypeScript errors
2. `/darkest/heroes` — 18 cards in 5-column grid; letter placeholder in each image area
3. Column selector switches to 3 / 5 / 10 correctly
4. Clicking a hero card opens modal; ESC and backdrop click close it; tall content scrolls
5. `/darkest/enemies` — 6 cards; modal shows type, ranks, abilities, tips
6. `/darkest/curios` — 8 cards; modal shows colour-coded base effect + item interaction rows
7. Existing expedition pages unaffected
