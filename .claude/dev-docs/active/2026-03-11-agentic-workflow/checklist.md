# Task Checklist — 2026-03-11-agentic-workflow

> Last Updated: 2026-03-11 23:41
> Status: Active

## Phase A: Testing Infrastructure Setup

- [ ] A1: Install testing dependencies (jest, @types/jest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @playwright/test, jest-environment-jsdom) — use `next/jest` preset instead of `ts-jest`
- [ ] A2a: Create `jest.config.ts` using `next/jest` preset (handles SWC transforms, path aliases, CSS/image mocking automatically)
- [ ] A2b: Create `jest.setup.ts` for @testing-library/jest-dom
- [ ] A3a: Create `playwright.config.ts` with dev server integration, screenshot-on-failure, trace collection
- [ ] A3b: Run `npx playwright install` to install browser binaries
- [ ] A3c: Set up `tests/e2e/` directory structure
- [ ] A4: Add npm scripts (test, test:watch, test:coverage, test:e2e, test:all)
- [ ] A5a: Create example unit test for `costCalculator.ts`
- [ ] A5b: Create example component test for `Button.tsx`
- [ ] A5c: Create example E2E test for login flow
- [ ] A5d: Verify all 3 baseline tests pass green
- [ ] A-gate: Verify `npm run build` still passes after test infrastructure setup

## Phase B: Orchestrator Skill System

- [ ] B0: Create `.claude/skills/` directory
- [ ] B1: Create master orchestrator skill `.claude/skills/workflow.md` (4-phase pipeline, quality gates, error handling)
- [ ] B2: Create Phase 1 skill `.claude/skills/workflow-design.md` (Explore agent, brainstorming, design.md output)
- [ ] B3: Create Phase 2 skill `.claude/skills/workflow-plan.md` (Plan agent, dev-docs creation, codebase validation)
- [ ] B4: Create Phase 3 skill `.claude/skills/workflow-execute.md` (TDD execution, checklist tracking, parallel subagents)
- [ ] B5: Create Phase 4 skill `.claude/skills/workflow-verify.md` (test suite, build, lint, code review, verification report)
- [ ] B6: Create error recovery skill `.claude/skills/workflow-recover.md` (build-error-resolver, debugging, user escalation)

## Phase C: Pipeline Integration & State Management

- [ ] C1: Extend dev-docs structure with `design.md` and `verification-report.md` templates
- [ ] C1: Add phase tracking field to planned-tasks.md format
- [ ] C2: Document pipeline state conventions in skills (phase reading, transitions, interrupted pipeline recovery)
- [ ] C3: Create skill index/registry file listing all workflow skills

## Phase D: Validation & Documentation

- [ ] D1: Run end-to-end test of full workflow on a small requirement ("Add a tooltip component")
- [ ] D1: Verify all 4 phases execute correctly and dev-docs are updated
- [ ] D2: Add workflow usage instructions to CLAUDE.local.md
- [ ] D2: Document quality gate criteria and error recovery procedures
