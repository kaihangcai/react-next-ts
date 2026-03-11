# Task Checklist — 2026-03-01-wiki-pages

> Last Updated: 2026-03-03 00:00
> Status: Active

## Phase 1 — Model

- [x] Create `src/models/wiki.ts` with WikiTag, CombatStyle, HeroAbility, HeroEntry interfaces
- [x] Add EnemyType, EnemyAbility, EnemyEntry interfaces to `src/models/wiki.ts`
- [x] Add CurioItemInteraction, CurioEntry interfaces to `src/models/wiki.ts`
- [x] Verify imports from `./darkest` (HeroClasses, Dungeon) resolve correctly

## Phase 2 — Modal Component

- [x] Add `"use client"` as first line of `src/components/UI/Modal.tsx`
- [x] Create `src/components/UI/Modal.tsx` with isOpen / onClose / title / children props
- [x] Implement ESC key listener via useEffect
- [x] Implement scroll lock (overflow: hidden on body) and cleanup on unmount
- [x] Implement backdrop click → close; stopPropagation on panel
- [x] Apply correct layout classes (backdrop, panel, header, close button)
- [x] Use `<X size={18} />` from lucide-react for close button

## Phase 3 — WikiGrid Component

- [x] Create `src/components/Darkest/WikiGrid.tsx` with columns / onColumnsChange / children props
- [x] Define static COLS_CLASS map: `{ 3: 'grid-cols-3', 5: 'grid-cols-5', 10: 'grid-cols-10' }`
- [x] Render column selector buttons [3] [5] [10] with active/inactive styles
- [x] Render `grid gap-3 ${COLS_CLASS[columns]}` container wrapping children

## Phase 4 — WikiCard Component

- [x] Create `src/components/Darkest/WikiCard.tsx` with name / imagePath / tags / onClick props
- [x] Render image area with aspect-square placeholder (initial letter) when no imagePath
- [x] Render `<Image>` with fill + object-contain + `sizes` prop when imagePath is provided
- [x] Render name (truncate) and tags row below image

## Phase 5 — Static Data Files

- [x] Create `src/data/heroes.ts` — all 18 HeroEntry objects matching HeroClasses enum
- [x] Verify all 18 HeroClasses values are covered (ABOMINATION through SHIELDBREAKER)
- [x] Apply correct tag colour conventions (Melee orange-30, Ranged blue-300, Support green-300, Hybrid purple-300)
- [x] Create `src/data/enemies.ts` — 6 EnemyEntry samples (bone-soldier, gargoyle, swine-slasher, fungal-scrub, drowned-crew, cultist-brawler)
- [x] Apply correct enemy type tag colours
- [x] Create `src/data/curios.ts` — 8 CurioEntry samples
- [x] Apply correct outcome tag colours (positive green-300, negative red-400, variable yellow-400)

## Phase 6 — Page Files

- [x] Replace content of `src/app/(game)/darkest/heroes/page.tsx` — WikiGrid + WikiCard + Modal, HeroModalContent component
- [x] HeroModalContent: image placeholder, combat style + positions badges, description, best dungeons, abilities list
- [x] Replace content of `src/app/(game)/darkest/enemies/page.tsx` — WikiGrid + WikiCard + Modal, EnemyModalContent component
- [x] EnemyModalContent: type + ranks + dungeons badges, description, abilities list, tips list
- [x] Replace content of `src/app/(game)/darkest/curios/page.tsx` — WikiGrid + WikiCard + Modal, CurioModalContent component
- [x] CurioModalContent: dungeon badges, colour-coded baseEffect paragraph, item interaction rows

## Phase 7 — Verification

- [x] `npm run build` passes with zero TypeScript errors
- [ ] `/darkest/heroes` shows 18 cards in 5-column default grid with letter placeholders
- [ ] Column selector correctly switches to 3 / 5 / 10 columns
- [ ] Hero card click opens modal; ESC and backdrop click close it; tall content scrolls
- [ ] `/darkest/enemies` shows 6 cards; modal shows type, ranks, abilities, tips
- [ ] `/darkest/curios` shows 8 cards; modal shows colour-coded base effect + item interaction rows
- [ ] Existing expedition pages are unaffected
