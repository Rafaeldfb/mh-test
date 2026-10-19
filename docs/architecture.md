# Architecture

## Technology stack

Verified against `package.json`, `tsconfig.json`, `vite.config.ts`, and the starter source:

- **React and React DOM:** browser UI components and mounting; plain CSS provides styling.
- **TypeScript:** application and mock-server code, shared contracts, and strict static checking.
- **Vite with the React plugin:** development server and frontend bundling.
- **Recharts:** declared charting dependency; not yet used by the starter UI.
- **Vitest:** test runner; see [Testing](testing.md) for existing coverage and script details.
- **Local mock API:** a Vite plugin serves JSON fixtures through browser `fetch`; no separate backend service is part of the starter.

The documented workflow uses **npm**: `npm install`, `npm run dev`, and `npm test` in [README](../README.md), plus `npm run build` in `package.json`. Both `package-lock.json` and `pnpm-lock.yaml` exist, but `package.json` does not pin a package manager. Their presence alone does not establish which manager was used for a local installation. No installed versions or minimum runtime version are asserted here.

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
| `tsconfig.json` / `package.json` | TypeScript settings / dependencies and executable scripts. |

The mock plugin uses `configureServer`; it has no `configurePreviewServer` hook. `npm run dev` serves the mock endpoints. The build script checks types and bundles the frontend; it does not produce an API service. No preview script or production API setup is configured, so the built frontend alone does not supply these endpoints.

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
