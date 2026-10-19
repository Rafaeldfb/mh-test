# Testing

## Configured commands

- `npm test` runs `vitest run`.
- `npm run dev` starts Vite with the local mock API.
- `npm run build` runs `tsc --noEmit && vite build`; this is not a test command.

The project uses Vitest. There is no separate test configuration, browser-test setup, coverage command, or lint script in the inspected starter. TypeScript strict checking is configured separately in `tsconfig.json`.

## Existing coverage

`src/api.test.ts` contains one test: it stubs global `fetch`, calls `askAgent`, and checks that the question is URL-encoded. It does not exercise the mock server or verify a real response shape.

There are no existing tests for `fetchData`, HTTP failures, dashboard rendering, loading states, chart transformations, or annual investment comparisons. When those behaviors are implemented, these are relevant verification gaps; see [Architecture](architecture.md) for the data constraints.

For manual failure checks during development, use the mock API's `fail=1` query parameter as described in [Architecture](architecture.md). The current UI has no API or failure-toggle wiring.

## Verification status

This documentation was checked against source files and configuration only. No tests, build, or application run was performed for this documentation update; configured commands do not establish passing results.
