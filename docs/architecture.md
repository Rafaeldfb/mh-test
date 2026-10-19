# Architecture

## Technology stack

Verified against `package.json`, `tsconfig.json`, `vite.config.ts`, and the starter source:

- **React and React DOM:** browser UI components and mounting; plain CSS provides styling.
- **TypeScript 6:** application and mock-server code, shared contracts, and strict static checking. Version 6.0.3 replaces 7.0.2 to use the compiler API supported by typescript-eslint.
- **Vite with the React plugin:** development server and frontend bundling.
- **Recharts:** declared charting dependency; not yet used by the starter UI.
- **Vitest:** test runner; see [Testing](testing.md) for existing coverage and script details.
- **ESLint 10:** flat configuration with recommended JavaScript/TypeScript rules, core React Hooks checks, and the Vite React Refresh preset.
- **Husky / lint-staged:** pre-commit ESLint checks for staged code, without automatic fixes; see [Testing](testing.md#pre-commit).
- **Local mock API:** a Vite plugin serves JSON fixtures through browser `fetch`; no separate backend service is part of the starter.

The README originally documents npm, but the existing installation uses **pnpm 10.11.0**. Use pnpm for dependency changes and the scripts in [Testing](testing.md). The ESLint setup updates `pnpm-lock.yaml`; the preexisting `package-lock.json` is retained unchanged and is now stale. Do not use `npm ci` for this dependency snapshot. `package.json` does not pin a package manager. Validation used Node 22.15.0.

Use this stack as the default. Discuss stack changes with the user before replacing the framework/toolchain or adding a backend/service. This does not prohibit installing supporting dependencies as allowed by the README.

## Structure and execution boundaries

`src/` contains the React frontend intended for the browser, plus its colocated unit test. `server/` contains development-only API simulation running in Vite's Node process. It is not an autonomous backend or a separately deployable service.

| Path | Responsibility |
| --- | --- |
| `index.html` | Browser entry page; loads `src/main.tsx`. |
| `src/main.tsx` | Mounts React `App` and imports the stylesheet. |
| `src/App.tsx` | Question form, local input state, and empty dashboard placeholder. |
| `src/styles.css` | Global frontend styles. |
| `src/api.ts` | Frontend HTTP client helpers using `fetch`, not server routes. |
| `src/types.ts` | Compile-time response and chart contracts, not backend logic or runtime validation. |
| `src/api.test.ts` | Unit test for the HTTP client; runs under Vitest, not as part of the UI. |
| `server/mock-api.ts` | Vite plugin registering development-server HTTP middleware. |
| `server/agent-response.json` | Static dashboard specification fixture. |
| `server/contribution-rows.json` | Static investment and attributed-sales fixture. |
| `vite.config.ts` | Registers the React and mock API plugins. |
| `eslint.config.js` | Lint rules, environment globals, and generated-output exclusions. |
| `tsconfig.json` / `package.json` | TypeScript settings / dependencies and executable scripts. |

The mock plugin uses `configureServer`; it has no `configurePreviewServer` hook. `npm run dev` serves the mock endpoints. The build script checks types and bundles the frontend; it does not produce an API service. No preview script or production API setup is configured, so the built frontend alone does not supply these endpoints.

## Chosen responsibility boundaries

The user chose separation of application responsibilities for future implementation. Here, “domains” means keeping transport, marketing calculations, React lifecycle, and presentation distinct; it does not prescribe DDD, bounded contexts, repositories, or service classes.

- **HTTP/API:** extend `src/api.ts` for requests, response parsing/validation, protocol errors, and forwarding cancellation signals. Keep it independent of React and DOM behavior. Coordinating the two API calls may remain a function in this module when cohesive.
- **Marketing calculations:** use pure functions for transformations and metrics, separate from fetching and rendering; never mutate input data.
- **React integration:** own lifecycle, request state, submit/retry, cancellation, and stale-result protection here. Extract a small hook when useful; keep transport and business rules outside it.
- **UI components:** handle events and presentation through those functions/actions, without inline fetching, HTTP parsing, substantial request orchestration, or extensive business calculations.

These are responsibility boundaries, not mandatory files per function, new folders, or a generic abstraction framework. `src/api.ts` already exists, but dashboard integration and the remaining separation are not implemented. See [implementation guidance](code-patterns.md#applying-the-chosen-boundaries) and the [Task 01 research](../tasks/01-render-dashboard/research.md#confirmed-fetching-boundary); detailed research options are not all approved by this direction. Task-specific layout stays in the task's design record.

## Request flow and current integration

**Existing UI:** `index.html` → `main.tsx` → `App`. Typing updates local question state. Submitting only prevents navigation; it does not call the API, and the dashboard stays empty.

**Available API path, not yet connected to the UI:** `askAgent(question)` → browser `fetch` → `/api/agent?q=...` → Vite middleware → agent fixture response. Separately, `fetchData()` → `/api/data` → the same middleware → period and data rows. There is no external agent call or database connection.

The endpoints implement these behaviors:

- `/api/agent?q=...` returns dashboard metadata and chart specifications after 1,500ms, echoing the question. Missing questions return HTTP 400.
- `/api/data` returns the same period and contribution rows after 400ms.
- A `fail=1` query parameter returns HTTP 500 after 400ms. For example: `/api/agent?q=test&fail=1` or `/api/data?fail=1`.

**Pending integration required by [README](../README.md):** connect submission to the helpers, combine the specification and rows into the panel, and display loading/errors and annual investment variation. Request ordering, state handling, transformations, and chart rendering are not implemented or prescribed by this map.

## Supplied contracts and unresolved handling

The agent fixture specifies ROI by channel (bar), investment by vehicle (bar), and attributed-sales share by channel (pie). The type contract also permits line charts. `roi` means attributed sales divided by investment, not profit margin.

Data rows mix channel totals (`vehicle: null`) with vehicle details; summing both levels would double-count values. TikTok has no prior-year baseline. Also, channel-total investment sums to R$3.7m, while the agent summary names Google Search as the highest-return channel and TV as the largest investment. These are fixture facts, not implemented UI calculations.

Aggregation and missing-baseline presentation remain unresolved. See [README](../README.md) for requirements and deliverables; this document does not prescribe new layers or folders.
