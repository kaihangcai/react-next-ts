# Key Files & Decisions — 2026-03-11-agentic-workflow

> Last Updated: 2026-03-11 23:41

## Key Files

| File | Change |
|------|--------|
| `jest.config.ts` | Create Jest config for Next.js + TypeScript |
| `jest.setup.ts` | Create testing-library/jest-dom setup |
| `playwright.config.ts` | Create Playwright E2E config with dev server |
| `package.json` | Add test dependencies (jest, testing-library, playwright) and scripts |
| `tsconfig.json` | Add jest types if needed |
| `.claude/skills/workflow.md` | Create master orchestrator skill (4-phase pipeline) |
| `.claude/skills/workflow-design.md` | Create Phase 1 skill — Explore + brainstorming |
| `.claude/skills/workflow-plan.md` | Create Phase 2 skill — Plan agent + dev-docs creation |
| `.claude/skills/workflow-execute.md` | Create Phase 3 skill — TDD execution with subagents |
| `.claude/skills/workflow-verify.md` | Create Phase 4 skill — Test/build/lint/review |
| `.claude/skills/workflow-recover.md` | Create error recovery skill |
| `CLAUDE.local.md` | Add workflow usage documentation |
| `.claude/dev-docs/planned-tasks.md` | Add T4 entry with phase tracking |
| `src/__tests__/utils/costCalculator.test.ts` | Create example unit test |
| `src/__tests__/components/Button.test.tsx` | Create example component test |
| `tests/e2e/auth.spec.ts` | Create example E2E test |

## Architectural Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Skills as pipeline stages | Each phase can run independently or be chained; allows re-running on failure | User may need to manually invoke phases if chaining fails |
| Dev-docs as state machine | Durable state that survives session boundaries; integrates with existing project conventions | Relies on file I/O for state; no real-time sync |
| Quality gates between phases | Prevents cascading failures; each phase validates before next | Adds latency; strict gates may block on minor issues |
| Jest + Playwright for testing | Industry standard; good Next.js integration; separate unit and E2E concerns | Two tools to maintain; Playwright requires browser install |
| TDD in execution phase | Catches regressions early; forces clear interface design before implementation | Overhead for trivial changes; mitigated by scope detection |
| Error recovery as separate skill | Clean separation of concerns; can be invoked independently | Extra skill file to maintain |
| Use `next/jest` instead of `ts-jest` | Next.js 15 uses ESM (`module: es2020`); raw `ts-jest` can't handle SWC transforms, path aliases, or CSS/image mocking. `next/jest` provides all of this out of the box. | Couples Jest config to Next.js version; acceptable since project is Next.js-native |

## Deviations from Plan
*(Updated during execution — record any mid-task pivots here)*
