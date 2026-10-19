# Testing

## Configured commands

- `pnpm lint` runs `eslint . --max-warnings 0`.
- `pnpm typecheck` runs `tsc --noEmit` without bundling.
- `pnpm test` runs `vitest run`.
- `pnpm dev` starts Vite with the local mock API.
- `pnpm build` runs `tsc --noEmit && vite build`; this is not a test command.

The project uses Vitest. There is no separate test configuration, browser-test setup, or coverage command in the inspected starter. TypeScript strict checking is configured separately in `tsconfig.json`.

## Lint scope

`eslint.config.js` covers JavaScript and TypeScript files, including `src/`, `server/`, and root configuration files. It ignores `node_modules`, `dist`, and `coverage`. Browser globals apply to frontend files; Node globals apply to the mock server, configuration, and tests.

Recommended JS/TS rules run without type-aware analysis; TypeScript checking remains a separate command. Core Hooks rules check call order and effect dependencies. React Refresh checks TSX exports with the Vite preset. No formatting or React Compiler rules are enabled.

## Pre-commit

`pnpm prepare` activates Husky (`core.hooksPath=.husky/_`); the same prepare script runs after dependency installation. `.husky/pre-commit` runs `pnpm exec lint-staged` with the configuration in `package.json`.

Only staged JS/JSX/TS/TSX and their module extensions are sent to ESLint. The command reports errors and warnings without `--fix`; ignored generated files do not produce warnings. Documentation-only commits skip ESLint. The pre-commit hook does not run typechecking, tests, builds, or formatting.

lint-staged temporarily hides unstaged portions of partially staged files and restores them afterward. Its normal backup/recovery behavior remains enabled. Fix reported problems with context, then explicitly stage the intended correction before retrying. Node and pnpm must be available in the committing process's PATH.

Husky 9.1.7 and lint-staged 16.4.0 were validated with pnpm 10.11.0 and Node 22.15.0. lint-staged 17 requires a newer Node and was not selected. Isolated Git fixtures verified valid code (including a filename with spaces), rejection of invalid staged code, documentation-only changes, both directions of partial staging, ignored output, and a documentation-only alternate-index invocation. Each preserved index entries and working-tree contents without leftover stashes. No test commits or staging were performed in the project repository.

## Pre-push

`.husky/pre-push` runs `pnpm typecheck`, then `pnpm lint`, then `pnpm test`, strictly in that order. The first failure stops the sequence and blocks the push. Checks cover the current working tree, including unstaged changes; they do not isolate the commits being pushed. No build, formatting, or automatic fixes run.

The hook uses the existing Husky activation and requires Node and pnpm in the pushing process's PATH. An isolated fixture verifies success and failure at each step, including skipped later steps and a nonzero hook exit status. The real project checks were also run in sequence without a push or commit.

## Existing coverage

`src/chart-data.test.ts` checks fixture totals, five channel/seven vehicle points, supplied ROI, invalid denominators, and immutability. `src/api.test.ts` checks transport errors, consumed contracts (including chart-discriminant coercion), signal forwarding/cancellation, fresh retry, parallel completion, and consistency. `src/data-integrity.test.ts`, `src/dashboard-messages.test.ts` and `src/format.test.ts` add focused external-review regressions for reconciliation, contextual messages and localized ROI ticks. There are 28 tests across 5 files.

No hook/DOM/integration/E2E suite is included. Browser-only inspection covered states, endpoint failures/retry, StrictMode lifecycle, keyboard access, responsive clearance, and reduced motion; see [Task 01 evidence](../tasks/01-render-dashboard/README.md#review-and-validation-results) and [external-review follow-up](../tasks/01-render-dashboard/review-decisions.md#validation). These checks are manual evidence, not unit coverage.

For manual failure checks during development, use the mock API's `fail=1` query parameter as described in [Architecture](architecture.md). Use development-only request interception to apply that query parameter; the production UI has no failure switch.

## Verification status

Task 01: `pnpm typecheck`, `pnpm lint`, and `pnpm test` passed after the external-review fixes (28 tests). No build was run. Deliverable records contain review outcomes and measured size/complexity, since normal lint does not enforce those gates.

Vitest still emits the existing future native-loader advisory for the Vite config's extensionless mock import and JSON imports without attributes. It does not fail checks.
