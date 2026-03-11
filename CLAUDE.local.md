# Claude Project Instructions

## Dev-Docs Workflow

This project uses a local dev-docs system to track planned tasks across sessions.
All state lives under `.claude/dev-docs/`.

```
.claude/dev-docs/
├── planned-tasks.md          ← task registry (IDs, short names, status)
├── active/<task-dir>/        ← work in progress
│   ├── plan.md
│   ├── decisions.md
│   └── checklist.md
├── blocked/<task-dir>/       ← paused (external dependency)
└── completed/<task-dir>/     ← finished tasks
```

### Referencing Planned Tasks

Before starting any implementation work, check `.claude/dev-docs/planned-tasks.md`
to see what tasks exist and which are active. Tasks are identified by:

- **ID** — `T<N>` (e.g., `T1`). Use this as the canonical reference in conversation.
- **Short name** — 2–3 word label (e.g., "Backend Consolidation").
- **Task dir** — `<YYYY-MM-DD>-<kebab-short-name>` (e.g., `2026-02-28-backend-consolidation`).

When the user refers to a task by ID or short name, resolve it via `planned-tasks.md`
and read the corresponding `checklist.md` to understand current progress before acting.

---

## Skills

### `/dev-docs` — Create Dev-Doc Files for a New Plan

**When to use:** Immediately after the user accepts a plan and exits plan mode.

**What it does:**
- Derives a `task-dir` slug from the plan title: `<YYYY-MM-DD>-<kebab-short-name>`
- Creates three files under `.claude/dev-docs/active/<task-dir>/`:
  - `plan.md` — objective, approach, full plan text verbatim
  - `decisions.md` — key files table + architectural decisions table
  - `checklist.md` — every action item as checkboxes, grouped by phase
- All new tasks default to **Active** status

**After running:**
- Add the new task to `.claude/dev-docs/planned-tasks.md` (next sequential `T<N>` ID,
  2–3 word short name, task dir path, status, one-line description).

**Existing task handling:**
- Same goal, adjusted approach → run `update-dev-docs` instead; record changes under
  `## Deviations from Plan` in `decisions.md`.
- Significantly changed scope → re-run `/dev-docs` to overwrite `plan.md` and reset
  checklist; preserve existing `decisions.md` content under a new `## Revision <N>` section.

---

### `/plan-reviewer` — Review a Newly Created Plan

**When to use:** After `/dev-docs` has run and the three files exist. Run once per plan
before any implementation work begins to catch problems early.

**What it does:**
- Reads `plan.md`, `decisions.md`, and `checklist.md` for the given task
- Cross-checks every MODIFY and CREATE file against the real codebase
- Verifies all referenced imports, types, constants, and components exist at the stated paths
- Produces a structured `review.md` report with:
  - ✅ Confirmed — elements verified correct against the codebase
  - ⚠️ Warnings — issues that won't block but should be noted
  - ❌ Blockers — issues that will cause failures if not fixed before implementation
  - 📋 Checklist Audit — missing or misplaced checklist items
  - 💡 Suggestions — up to 5 low-scope risk-reduction ideas
- Saves the report to `.claude/dev-docs/<status>/<task-dir>/review.md`
- **If blockers or missing checklist items are found:** proposes specific updates to
  `checklist.md` and `decisions.md` and asks for user permission before applying them

**Invoke with:** `/plan-reviewer T2` (task ID) or `/plan-reviewer 2026-03-01-expedition-journal` (slug)

---

### `/update-dev-docs` — Sync Progress on an Active Task

**When to use (trigger automatically — no user prompt needed):**
- After every completed phase or milestone in the active task's checklist
- After any significant discovery that changes the approach (new files, scope changes, deviations)
- After fixing a non-trivial error that affects the implementation path
- After the build passes for the first time during a task
- When the user says "update the docs", "mark that done", or "sync dev docs"

**Do NOT wait to be asked** — proactively call `/update-dev-docs` at each of the above
trigger points to keep the checklist and decisions.md accurate between sessions.

**What it does:**
- Checks off completed items in `checklist.md`
- Records new discoveries or pivots under `## Deviations from Plan` in `decisions.md`
- Updates the `Last Updated` timestamp in both files
- Proposes status transitions (Active → Blocked → Completed) with user permission before
  moving the task directory

**Status change rules:**
- Never move a task between status folders without explicit user approval.
- Completed = all checklist items checked off and user confirms the task is done.

---

## Task Directory Naming Convention

| Component | Rule | Example |
|-----------|------|---------|
| Date | ISO date the plan was accepted | `2026-02-28` |
| Short name | 2–3 words, kebab-case | `backend-consolidation` |
| Full dir | `<date>-<short-name>` | `2026-02-28-backend-consolidation` |

Task IDs in `planned-tasks.md` are sequential integers prefixed with `T` (`T1`, `T2`, …).
The ID never changes once assigned, even if the task is renamed or moved.
