# 02 — API client and combined loader

Status: Complete.

## Goal and prerequisites

Expose a React-independent function that returns one coherent specification/data pair or rejects with meaningful context. Existing [API helpers](../../../src/api.ts) and [contracts](../../../src/types.ts) are the starting point. Delivery [01](01-chart-data.md) establishes the numeric/unavailable policy: boundary validation must not accidentally reject legitimate zero values or silently replace unavailable ratios.

Read [fetching boundary](../research.md#confirmed-fetching-boundary), [lifecycle research](../research.md#fetch-lifecycle-proposal-revised), [unit matrix](../testing-strategy.md#planned-unit-matrix), and [shared boundaries](../../../docs/architecture.md#chosen-responsibility-boundaries). Consult the actual [mock](../../../server/mock-api.ts) for endpoint behavior; the frontend must still handle real fetch failures.

## Scope and output

Extend `src/api.ts` and its tests. Add a combined loader there unless size/cohesion justifies another module; no generic HTTP framework. Both helpers accept a signal and preserve existing question encoding. The loader starts both independent requests in parallel and returns only their combined validated result.

Validate only consumed metadata, chart combinations, period boundaries, labels, and numeric fields with small guards; parse unknown data rather than relying on a TypeScript cast. Do not require fixture-specific values or counts, validate annual-baseline policy, or add a schema dependency. Reject incompatible response periods and unsupported combinations with context. A matching period does not prove a shared backend snapshot; no backend contract change is part of this slice.

Distinguish HTTP errors, network failure, JSON/contract errors, and intentional abort. Keep user-facing Portuguese messages in React integration. Pass caller-owned cancellation through both calls. `Promise.all` does not cancel siblings: the caller/controller owner in 03 will abort remaining work after loader rejection, preserving that original error. State this contract clearly; do not introduce a second cancellation owner.

## Acceptance and validation

- Successful calls return both complete responses; resolving one alone never returns a partial pair.
- Either endpoint's HTTP/network/JSON/contract failure rejects with endpoint context. A mismatched period rejects; valid fixture responses pass.
- Unit tests exercise URL encoding, data URL, signal forwarding, pre-aborted/aborted operations with signal-aware mocks, and completion order using deferred promises without real delay sleeps.
- Update the existing `{}` response stub if validation requires a valid response; restore globals/mocks between cases. No Vite server or UI harness is required.

Run focused tests and the plan's handoff checks. Actual sibling abortion by the React owner is validated in 03, not falsely credited to this loader's `Promise.all` tests.

Out of scope: React state, DOM, caching, automatic retries, timeouts without a requirement, backend changes, charts, or new packages.

## Execution evidence

Implemented `src/api.ts`, `src/api-validation.ts`, and API tests. `loadDashboard(question, signal)` validates and returns `{ agent, data }` atomically, checking period boundaries and echoed question. `ApiError` identifies endpoint and HTTP/network/JSON/contract category. Caller owns cancellation and must abort siblings after rejection while retaining the original error. Annual baseline is unconsumed and deliberately not validated here.

Typecheck, lint, and test passed (14 tests across 2 files), including fixture reconciliation, signal-aware cancellation, fresh retry, completion ordering, either-endpoint failure and consumed-contract errors. No React or browser coverage claimed. Reviewer `gpt-6.1-sol` high caught array coercion in chart discriminants; primitive-string guards and a three-field regression resolved it. Re-review found no remaining correctness issues. Measured API/validator/test code lines: 49/60/110; max complexity: 9/4/3. The cohesive transport function exceeds the complexity target but stays below 10. Exception: the outer test-suite callback is 62 lines (maximum 60), only grouping independent tests whose largest body is 16 lines; retained for readable grouping.
