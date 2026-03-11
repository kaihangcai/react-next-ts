# Plan — 2026-03-11-agentic-workflow

> Generated: 2026-03-11 23:36

## Objective
Create a fully automated, orchestrated agentic workflow that takes a requirement as input and automatically handles design, planning, execution, and testing — producing a complete, tested implementation with minimal human intervention.

## Approach
Build a 4-phase orchestrated pipeline implemented as Claude Code skills that chain together via a master orchestrator skill. Each phase uses specialized subagents for parallel work and the dev-docs system for state persistence across sessions. A testing infrastructure prerequisite (Jest + Playwright) must be set up first.

## Accepted Plan

# Implementation Plan: Agentic Development Workflow

## Objective

Create a fully automated, orchestrated agentic workflow that takes a requirement as input and automatically handles **design, planning, execution, and testing** — producing a complete, tested implementation with minimal human intervention.

## Task Type
- [x] Fullstack (orchestration layer + testing infrastructure)

---

## Technical Solution

Build a **4-phase orchestrated pipeline** implemented as Claude Code skills that chain together via a master orchestrator skill. Each phase uses specialized subagents for parallel work and the dev-docs system for state persistence across sessions.

### Architecture Overview

```
User Requirement
       │
       ▼
┌──────────────────────────┐
│  /workflow <requirement>  │  ← Master orchestrator skill
│                          │
│  Phase 1: DESIGN         │  → Explore agent + brainstorming
│  Phase 2: PLAN           │  → Plan agent + dev-docs creation
│  Phase 3: EXECUTE        │  → Parallel subagents (implement + review)
│  Phase 4: VERIFY         │  → Build check + test runner + code review
│                          │
│  State: .claude/dev-docs │  ← Persistent tracking
│  Gate: Each phase must   │
│        pass before next  │
└──────────────────────────┘
       │
       ▼
  Tested, reviewed code
  with updated dev-docs
```

### Key Design Decisions

1. **Skills as pipeline stages** — Each phase is a standalone skill that can be run independently or chained by the orchestrator. This allows re-running individual phases on failure.

2. **Dev-docs as state machine** — Task status (Active/Blocked/Completed) and checklist progress provide durable state that survives session boundaries.

3. **Quality gates between phases** — The orchestrator checks phase output before proceeding. Phase 3 (Execute) won't start until Phase 2 (Plan) produces a valid checklist. Phase 4 (Verify) won't start until Phase 3 produces compilable code.

4. **Testing infrastructure as prerequisite** — Must install and configure Jest + React Testing Library + Playwright before the workflow can run its verify phase.

---

## Implementation Steps

### Phase A: Testing Infrastructure Setup (Prerequisite)

**Step A1**: Install testing dependencies
- Jest 29 + ts-jest + @types/jest
- @testing-library/react + @testing-library/jest-dom + @testing-library/user-event
- Playwright (@playwright/test)
- jest-environment-jsdom

**Step A2**: Configure Jest
- Create `jest.config.ts` with Next.js + TypeScript support
- Create `jest.setup.ts` for @testing-library/jest-dom
- Add `moduleNameMapper` for path aliases (`@/` → `src/`)
- Configure coverage thresholds (statements: 70%, branches: 60%)

**Step A3**: Configure Playwright
- Create `playwright.config.ts` with dev server integration
- Set up `tests/e2e/` directory structure
- Configure screenshot-on-failure, trace collection

**Step A4**: Add npm scripts
- `test` → jest
- `test:watch` → jest --watch
- `test:coverage` → jest --coverage
- `test:e2e` → playwright test
- `test:all` → jest && playwright test

**Step A5**: Create baseline tests
- One example unit test for a utility function (`costCalculator.ts`)
- One example component test for a simple component (`Button.tsx`)
- One example E2E test for login flow

**Deliverable**: Green test suite with 3 passing tests, scripts in package.json

---

### Phase B: Orchestrator Skill System

**Step B1**: Create the master orchestrator skill
- File: `.claude/skills/workflow.md`
- Accepts a requirement string as input
- Defines the 4-phase pipeline with quality gates
- Tracks state via dev-docs task creation
- Handles errors with retry logic and user escalation

**Step B2**: Create Phase 1 skill — Design & Analysis
- File: `.claude/skills/workflow-design.md`
- Uses Explore agent to gather codebase context relevant to the requirement
- Runs brainstorming analysis (affected files, approach options, risks)
- Outputs a structured design document to `.claude/dev-docs/active/<task>/design.md`
- Quality gate: Design document must contain sections: Affected Files, Approach, Risks

**Step B3**: Create Phase 2 skill — Planning
- File: `.claude/skills/workflow-plan.md`
- Takes design document as input
- Uses Plan agent to generate step-by-step implementation plan
- Creates dev-docs files (plan.md, decisions.md, checklist.md)
- Runs `/plan-reviewer` equivalent checks against codebase
- Quality gate: All referenced files/imports must exist, checklist must have items

**Step B4**: Create Phase 3 skill — Execution
- File: `.claude/skills/workflow-execute.md`
- Reads checklist.md and executes items sequentially
- For each checklist item:
  - Writes tests first (TDD — test file before implementation)
  - Implements the code change
  - Runs affected tests to verify
  - Checks off the item in checklist.md
- Uses parallel subagents for independent changes
- Quality gate: All checklist items checked, `npm run build` passes

**Step B5**: Create Phase 4 skill — Verification
- File: `.claude/skills/workflow-verify.md`
- Runs full test suite (`npm test`)
- Runs build check (`npm run build`)
- Runs lint check (`npm run lint`)
- Launches code-reviewer agent on all changed files
- Generates verification report
- Quality gate: All checks green, no critical review findings
- On success: Updates dev-docs status, prepares commit message

**Step B6**: Create error recovery skill
- File: `.claude/skills/workflow-recover.md`
- Handles phase failures (build errors, test failures, review blockers)
- Uses build-error-resolver agent for compile errors
- Uses systematic-debugging approach for test failures
- Escalates to user after 2 failed retry attempts

**Deliverable**: 6 skill files that form a complete pipeline

---

### Phase C: Pipeline Integration & State Management

**Step C1**: Extend dev-docs structure
- Add `design.md` template to dev-docs active task structure
- Add `verification-report.md` template
- Add phase tracking field to planned-tasks.md (current phase: design/plan/execute/verify/done)

**Step C2**: Create pipeline state helpers
- Conventions in the skills themselves:
  - How to read current phase from dev-docs
  - How to transition between phases
  - How to detect and recover from interrupted pipelines

**Step C3**: Create skill index/registry
- Update `.claude/skills/` with an index file listing all workflow skills
- Document the invocation pattern: `/workflow "Add dark mode toggle to settings page"`

**Deliverable**: Integrated pipeline with state management

---

### Phase D: Validation & Documentation

**Step D1**: End-to-end test of the workflow
- Run the full pipeline on a small, well-defined requirement
- Suggested test requirement: "Add a tooltip component to the UI library"
- Verify all 4 phases execute correctly
- Verify dev-docs are created and updated properly
- Verify tests are written and passing

**Step D2**: Document the workflow
- Add usage instructions to CLAUDE.local.md
- Document each skill's purpose and invocation
- Document quality gate criteria
- Document error recovery procedures

**Deliverable**: Validated, documented workflow system

---

## Key Files

| File | Operation | Description |
|------|-----------|-------------|
| `jest.config.ts` | CREATE | Jest configuration for Next.js + TS |
| `jest.setup.ts` | CREATE | Testing library setup |
| `playwright.config.ts` | CREATE | Playwright E2E config |
| `package.json` | MODIFY | Add test dependencies and scripts |
| `tsconfig.json` | MODIFY | Add jest types if needed |
| `.claude/skills/workflow.md` | CREATE | Master orchestrator skill |
| `.claude/skills/workflow-design.md` | CREATE | Phase 1: Design & analysis |
| `.claude/skills/workflow-plan.md` | CREATE | Phase 2: Planning |
| `.claude/skills/workflow-execute.md` | CREATE | Phase 3: TDD execution |
| `.claude/skills/workflow-verify.md` | CREATE | Phase 4: Verification |
| `.claude/skills/workflow-recover.md` | CREATE | Error recovery |
| `CLAUDE.local.md` | MODIFY | Add workflow documentation |
| `.claude/dev-docs/planned-tasks.md` | MODIFY | Add T4 entry |
| `src/__tests__/utils/costCalculator.test.ts` | CREATE | Example unit test |
| `src/__tests__/components/Button.test.tsx` | CREATE | Example component test |
| `tests/e2e/auth.spec.ts` | CREATE | Example E2E test |

---

## Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| Skills can't call other skills programmatically | Orchestrator skill contains inline instructions for each phase; user triggers phases sequentially if chaining fails |
| Test infrastructure conflicts with existing build | Install with `--save-dev`, isolate test configs, verify `npm run build` still works after setup |
| Agent subprocesses may timeout on large changes | Set generous timeouts (600s), break large phases into smaller checklist items |
| Dev-docs state can become stale across sessions | Each phase reads current state before acting; recovery skill can reset stale state |
| TDD adds overhead for simple changes | Workflow skill detects change scope; skips E2E for trivial changes, always requires unit tests |

---

## Execution Order

```
A1 → A2 → A3 → A4 → A5 (testing infra, sequential)
     ↓
B1 → B2 ─┐
     B3 ──┤ (skills can be written in parallel after B1)
     B4 ──┤
     B5 ──┤
     B6 ──┘
     ↓
C1 → C2 → C3 (integration, sequential)
     ↓
D1 → D2 (validation, sequential)
```

Estimated file changes: ~16 new files, ~3 modified files
