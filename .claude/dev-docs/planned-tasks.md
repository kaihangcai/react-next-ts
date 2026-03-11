# Planned Tasks

Registry of all dev-doc tasks. Each entry has a short ID and a 2–3 word name.
Full details live in `.claude/dev-docs/<status>/<task-dir>/`.

## Convention

| Field | Format | Example |
|-------|--------|---------|
| ID | `T<N>` (sequential) | `T1` |
| Short name | 2–3 words, Title Case | `Backend Consolidation` |
| Task dir | `<YYYY-MM-DD>-<kebab-short-name>` | `2026-02-28-backend-consolidation` |
| Status | `active` / `blocked` / `completed` | `active` |

---

## Task List

| ID | Short Name | Task Dir | Status | Description |
|----|-----------|----------|--------|-------------|
| T1 | Backend Consolidation | `completed/2026-02-28-backend-consolidation` | Completed | Eliminate the separate `react-next-backend` Express microservices by moving all API logic into Next.js Route Handlers. Adds Prisma 6 + SQLite, migrates to NextAuth v5, replaces MUI with lucide-react + Tailwind, and fixes all hardcoded localhost URLs. |
| T2 | Expedition Journal | `active/2026-03-01-expedition-journal` | Active | Extend `/darkest/expedition` into a full expedition journal with New Entry form (heroes, provisions, loot, outcome, casualties, rating) and History tab showing past runs. |
| T3 | Wiki Pages | `active/2026-03-01-wiki-pages` | Active | Turn the three empty placeholder pages (Heroes, Enemies, Curios) into wiki-style reference pages with a card grid, column selector, and modal detail view backed by static TypeScript data files. |
| T4 | Agentic Workflow | `active/2026-03-11-agentic-workflow` | Active | Fully automated orchestrated pipeline (design → plan → execute → verify) implemented as Claude Code skills with testing infrastructure (Jest + Playwright) and dev-docs state tracking. |
