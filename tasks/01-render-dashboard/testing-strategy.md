# Task 01 unit testing strategy

Status: Plan only; no tests or dashboard implementation added or executed for this document. Scope is unit tests with existing Vitest. See [acceptance](README.md), [research](research.md), [design](design.md), and [test commands](../../docs/testing.md).

## Current coverage and policy boundaries

`src/api.test.ts` has one test: it stubs fetch and verifies question URL encoding. It does not validate payloads, run the mock server, or exercise UI state. No DOM or React-hook test harness is configured.

The separate fetching layer and chosen visual direction are confirmed. Selection of total/detail rows, unavailable-ratio representation, validation policy, and lifecycle mechanics remain proposals in [research](research.md) and the [decision brief](decision-brief.md). Before writing policy-specific assertions, record the implementation choice and reason in the task record. Tests should verify that choice without silently introducing new requirements. Annual baseline handling is outside Task 01.

## Planned unit matrix

| Responsibility | Cases after the relevant implementation exists | Future evidence |
| --- | --- | --- |
| Pure chart transformation | Supplied fixture yields five channel points and seven vehicle points under the proposed selection policy. Investment totals R$3.7m and contribution R$10.1m; do not include totals and details together. Check meaningful labels and values, not only array lengths. | Focused assertions against returned chart data and fixture totals. |
| Ratio calculation | Sales / investment; TV is 2.25. If combining rows, use ratio of sums: Globo/SBT give 2.25 rather than the simple mean 2. Zero sales with positive investment gives zero. Zero, negative, or non-finite denominator handling follows the recorded invalid-value policy and never fabricates a valid zero ratio. | Small contrasting examples with expected numbers or the chosen unavailable result. These invalid denominators are defensive cases, absent from current fixtures. |
| Transformation purity | Input rows and order remain unchanged after transformation, including sorting/grouping paths. | Frozen input or a small before/after comparison; no large output snapshots. |
| API client | Encoded question, correct data URL, successful parsing, HTTP non-OK rejection, network rejection, malformed JSON, signal forwarding, and abort rejection. If runtime validators are adopted, test missing/wrong consumed fields and finite numeric requirements with minimal payloads. | Mock fetch plus real Response objects where useful; assert returned values or observable error category/context. Update the existing `{}` success stub when validation makes it invalid. |
| Combined loader | Starts both independent calls without waiting for the first. Resolving either alone leaves the result pending; both valid responses return one pair. Either endpoint failing rejects without publishing a partial pair. Divergent period boundaries reject under the proposed consistency policy. | Controlled promises, matching/mismatching minimal responses, and assertions on the combined result. |
| Cancellation ownership | Forward cancellation to both operations. When the controller owner aborts siblings after failure, preserve the original endpoint error rather than replacing it with abort. An already-aborted signal and a fresh retry use the documented behavior. | Signal-aware mocks; test in the loader or controller owner according to the final boundary, without moving React responsibilities merely to make them testable. |
| Isolatable attempt/state logic | If ordinary functions expose the behavior: only the latest accepted attempt commits; stale success/error/finally cannot clear newer pending state; retry preserves the submitted question and starts fresh. | Deferred completions deliberately resolved out of order, observing accepted state transitions. Do not claim React hook/unmount coverage from testing an extracted identity helper. |

## Test doubles and discipline

Stub only the external fetch boundary for client tests. For loader tests, use small dependency mocks or mocked fetch responses according to its final API. Deferred promises control completion order without sleeping for the mock server's 400/1,500 ms delays. An abort mock must observe the signal and reject deliberately; a stub that ignores cancellation cannot prove browser cancellation works.

Restore stubbed globals and mocks after each test (`vi.unstubAllGlobals` and appropriate mock cleanup). Use new controllers/responses per case. Avoid asserting internal helper call sequences except observable parallel start/signal propagation; assert outcomes and failure context instead. Reuse the supplied fixture for reconciliation, and small hand-built inputs for edge cases. No arbitrary coverage percentage or whole-dashboard snapshots.

## Execution criteria and limits

After authorized implementation, run `pnpm test`, `pnpm lint`, and `pnpm typecheck` as described in [Testing](../../docs/testing.md). Record actual commands, results, and remaining gaps in the task record. A successful unit result requires deterministic tests for the implemented matrix cases and no known failing assertions; planned or deferred cases must be identified explicitly. Do not run a build.

This strategy adds no integration, E2E, or automated browser scope. Unit tests do not prove Recharts rendering, responsiveness, fixed-composer clearance, skeleton/reveal appearance, focus, screen-reader announcements, reduced motion, or React unmount/StrictMode cleanup. Those remain later manual verification needs; no new UI harness or dependencies are authorized here.
