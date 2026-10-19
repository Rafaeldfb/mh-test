# 01 — Pure chart data

Status: Complete.

## Goal and prerequisites

Produce deterministic chart points from contribution rows without HTTP or React. No earlier deliverable is required: [types](../../../src/types.ts), [agent specification](../../../server/agent-response.json), and [rows](../../../server/contribution-rows.json) already exist. This slice creates testable data, not visible charts.

Minimum context: [task acceptance](../README.md#observable-acceptance), [proposed plan decisions](../plan.md#adopted-implementation-decisions), [data research](../research.md#data-transformation-proposal), and [unit matrix](../testing-strategy.md#planned-unit-matrix). Apply the shared [code patterns](../../../docs/code-patterns.md) and [quality gates](../../../docs/quality-gates.md) when writing code.

## Scope and output

Add a small pure transformation module under `src/` with colocated Vitest tests; choose cohesive filenames during execution. Consume existing contracts; extend a presentation point type only if necessary. Keep numeric values separate from locale formatting.

Under the plan's proposed policy, select `vehicle: null` for channel points and named vehicles for vehicle points. Preserve API chart order at the consumer boundary. Support only the supplied bar ROI/channel, bar investment/vehicle, and pie contribution/channel combinations; do not build a matrix of hypothetical chart types. Retain channel context in vehicle identity.

Calculate ROI as contribution/investment; if grouping is actually needed, calculate the ratio after summing amounts. Represent invalid denominators explicitly under the adopted policy. Do not mutate or sort response arrays in place. Document adopted policy and reason in the task record.

## Acceptance and validation

- The fixture produces five channel points and seven vehicle points; marketing channels remain distinct from vehicles.
- Selected investment sums to R$3.7m and contribution to R$10.1m; totals/details are never added together. Pie values represent contribution, not investment.
- ROI is TV 2.25, YouTube 3, Meta 2.8, Google Search 4, TikTok 2. Zero sales with positive investment gives zero; unavailable ROI is not zero/Infinity.
- Unit cases cover meaningful labels/values, the TV weighted-ratio distinction where applicable, defensive invalid denominators, and input immutability. Use the fixture plus small cases, not large snapshots or unused aggregation machinery.

Run focused Vitest cases and the plan's handoff checks. Record actual results below; no browser or hook coverage is claimed. See [mock discipline](../testing-strategy.md#test-doubles-and-discipline).

Out of scope: transport, lifecycle, formatting/layout, baseline/year comparison, new dependencies, or Git actions. Consumers in 04 will use these outputs.

## Execution evidence

Implemented `src/chart-data.ts` and colocated tests. Channel charts select total rows; vehicle charts select details, preserving channel context and input order. ROI uses supplied totals directly, avoiding an unused aggregator. Nonpositive/non-finite investment or non-finite results produce `null`; valid zero sales produces zero.

`pnpm typecheck`, `pnpm lint`, and `pnpm test` passed (4 tests across 2 files), using the installed Node 22 runtime. The existing Vite native-loader advisory remains. No browser/hook coverage applies to this pure-data slice. Reviewer `gpt-6.1-sol` high found no code issues; independently passed all checks. Measured source/test code lines: 26/38; maximum function lines: 13/26; maximum classic complexity: 4/2.
