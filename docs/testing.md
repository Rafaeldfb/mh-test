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

`src/api.test.ts` contains one test: it stubs global `fetch`, calls `askAgent`, and checks that the question is URL-encoded. It does not exercise the mock server or verify a real response shape.

There are no existing tests for `fetchData`, HTTP failures, dashboard rendering, loading states, chart transformations, or annual investment comparisons. When those behaviors are implemented, these are relevant verification gaps; see [Architecture](architecture.md) for the data constraints.

For manual failure checks during development, use the mock API's `fail=1` query parameter as described in [Architecture](architecture.md). The current UI has no API or failure-toggle wiring.

## Verification status

After the ESLint setup and TypeScript 6.0.3 change, `pnpm lint`, `pnpm typecheck`, and `pnpm test` passed (one existing test). No build or browser validation was run.

Vitest emits a Vite warning about a future native configuration loader: the starter uses an extensionless mock-plugin import and JSON imports without attributes. This does not fail the current test and was left unchanged.
