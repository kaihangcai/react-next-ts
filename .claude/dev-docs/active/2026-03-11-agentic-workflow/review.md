# Plan Review — 2026-03-11-agentic-workflow
> Reviewed: 2026-03-11

## Summary
The plan is well-structured with clear phases and dependencies, but has **one blocker** around Jest configuration that will cause setup failures if not addressed. The ESM/CJS module conflict between Next.js 15's ESM setup and Jest's CommonJS expectation requires using `next/jest` instead of raw `ts-jest`. Additionally, a few minor checklist gaps and a tsconfig concern should be fixed before starting. **Needs minor fixes before implementation.**

## ✅ Confirmed
- All 16 CREATE target files do not yet exist — no conflicts
- All MODIFY target files exist and are accessible:
  - `package.json` — standard Next.js scripts, devDependencies section present
  - `tsconfig.json` — has `@/*` path alias configured (matches plan's moduleNameMapper intent)
  - `CLAUDE.local.md` — exists with current dev-docs instructions
  - `.claude/dev-docs/planned-tasks.md` — T4 entry already registered
- `src/utils/costCalculator.ts` exists with exported `calculateProvisionCost(provisions)` — good unit test target
- `src/components/UI/Button.tsx` exists as a simple functional component with `label`, `onClick`, `className`, `disabled` props — good component test target
- `src/app/auth/page.tsx` and `src/app/auth/layout.tsx` exist — viable E2E test target
- `Provisions` interface exported from `src/models/expedition.ts:8`
- `PROVISION_COSTS` available at `src/utils/Constants/shop.ts`
- Node v24.14.0 / npm 11.9.0 — fully compatible with all planned dependencies
- Phase dependency order (A→B→C→D) is correct; B2-B6 parallelism after B1 is sound

## ⚠️ Warnings
1. **tsconfig module format**: `tsconfig.json` uses `"module": "es2020"` which is ESM. Jest historically expects CommonJS transforms. The plan should explicitly note using `next/jest` or a separate `tsconfig.jest.json` to avoid transform errors. *(See blocker below for resolution.)*

2. **Button.tsx uses default export**: The test must use `import Button from ...` not named import. Minor, but worth noting since the plan doesn't specify import patterns for tests.

3. **`.claude/skills/` directory does not exist**: Plan assumes it exists for Phase B. Needs a `mkdir -p` step or a checklist item to create it.

4. **Plan text contradiction in Step C2**: The plan first says "File: `src/utils/pipeline-state.ts`" then immediately says "Actually this lives as conventions in the skills themselves." The checklist correctly omits the file, but the plan text is confusing and should be cleaned up.

5. **React 18.2.0 pinned version**: `@testing-library/react` v15+ requires React 18.x (satisfied), but if React is ever upgraded to 19, testing-library compatibility should be rechecked.

## ❌ Blockers
1. **Jest ESM configuration — use `next/jest` instead of `ts-jest`**
   - **Plan says**: "Jest 29 + ts-jest" and "Create `jest.config.ts` with Next.js + TypeScript support"
   - **Issue**: Next.js 15 uses ESM (`"module": "es2020"` in tsconfig). Raw `ts-jest` does not handle Next.js's SWC transforms, path aliases, or CSS/image mocking. This will cause immediate import failures.
   - **Required fix**: Use `next/jest` (built into Next.js 15) as the Jest preset. This handles SWC compilation, path alias resolution, CSS mocking, and image transforms automatically. Remove `ts-jest` from the dependency list; replace with `next/jest` config pattern:
     ```ts
     import nextJest from 'next/jest'
     const createJestConfig = nextJest({ dir: './' })
     ```
   - This also eliminates the need to manually configure `moduleNameMapper` for `@/` aliases.

## 📋 Checklist Audit
- **Missing items identified:**
  - No item to create `.claude/skills/` directory before Phase B starts
  - No item to verify `npm run build` still passes after installing test dependencies (end of Phase A)
  - No item for `tsconfig.json` modification (plan lists it as MODIFY in key files table, but no checklist item)
- **Orphan items**: None — all checklist items map to plan sections
- **Phase ordering**: Correct — A (infra) → B (skills) → C (integration) → D (validation)
- **Duplicate step labels**: A2 appears twice, A3 appears twice, A5 appears four times — consider sub-numbering (A2a/A2b, A3a/A3b, A5a-A5d) for clarity

## 💡 Suggestions
1. **Use `next/jest` preset** instead of `ts-jest` — reduces config complexity by ~60%, gets SWC transforms for free, and auto-handles CSS/image mocking. This resolves the blocker above.
2. **Add a "Phase A gate" checklist item**: After all Phase A items, add "Verify `npm run build` and `npm run test` both pass" before moving to Phase B.
3. **Consider `@next/env` for test environment**: If tests need env vars (e.g., `DATABASE_URL`), `next/jest` loads `.env.test` automatically — document this convention.
4. **Sub-number checklist items** (A2a/A2b instead of duplicate A2/A2) to make progress tracking unambiguous.
5. **Add Playwright browser install step**: `npx playwright install` is required after `npm install` — easy to forget and will cause E2E failures.
