# Code patterns

The conventions below describe the starter; the final section records the chosen direction for future implementation.

Apply [Quality gates](quality-gates.md) when writing or reviewing code for local size, complexity, and correctness criteria.

- Source uses TypeScript, ES module imports, double quotes, semicolons, and two-space indentation. ESLint uses a flat configuration in `eslint.config.js`; no formatter is configured.
- The pre-commit hook checks staged code with ESLint and never applies automatic fixes; see [Testing](testing.md#pre-commit).
- React components are functions in `.tsx` files with named exports. `App` uses `useState` for a controlled question input; `main.tsx` mounts it inside `StrictMode`.
- Shared API contracts use exported type aliases in `src/types.ts`, with string unions for chart types, metrics, and breakdowns. TypeScript strict mode is enabled in `tsconfig.json`.
- `src/api.ts` keeps fetch calls behind named helpers and imports contracts with `import type`. Its private generic helper rejects non-success HTTP responses and casts parsed JSON to the requested type; it does not validate response shapes at runtime.
- Styling uses plain CSS classes. Mock data is kept in JSON fixtures, and the existing unit test is colocated with its source.

There is no established routing, shared component library, state-management layer, or data-transformation module.

See the [architecture map](architecture.md#structure-and-execution-boundaries) for file responsibilities and execution boundaries, and [request flow](architecture.md#request-flow-and-current-integration) for current integration. See [Testing](testing.md) for test scope. Follow the root [comment rules](../AGENTS.md#code-comments) when adding explanations.

## Applying the chosen boundaries

Follow the [chosen responsibility boundaries](architecture.md#chosen-responsibility-boundaries) when adding UI or data fetching. Keep helpers small and cohesive; extraction should clarify responsibility, not create a layer for every function.

- Pass cancellation signals through API functions; let the React lifecycle owner manage cancellation and prevent stale attempts from updating state. Cancellation alone does not prove a result is current.
- Keep HTTP/network and response parsing/contract errors distinct from intentional cancellation; translate failures into UI state at the integration boundary rather than hiding them in calculations or JSX.
- Keep numeric transformations independent of display formatting and verify that inputs remain unchanged. Components consume their results and invoke submit/retry actions.

See [Task 01 research](../tasks/01-render-dashboard/research.md#fetch-lifecycle-proposal-revised) for proposed lifecycle details. The separation is chosen; exact hook extraction, loader design, validation strategy, and retry policy remain implementation choices within authorized scope.
