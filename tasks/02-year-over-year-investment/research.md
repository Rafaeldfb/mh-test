# Task 02 implementation research

Status: Research only; Task 02 is not started. No implementation or display policy is approved by this document. Scope comes from the [task record](README.md) and [challenge](../../README.md): investment variation for each marketing channel against the same period last year. Task 01 is implemented; preserve its three-chart flow and request behavior.

## Verified data and proposed calculation

Sources: [rows](../../server/contribution-rows.json), [period](../../server/agent-response.json), and [field contract](../../src/types.ts). Current period is July 1–September 30, 2026. The baseline contract means the same period in the previous year, so this fixture compares against July 1–September 30, 2025; no separate baseline-period response exists.

Proposed natural formulas are absolute change = current investment − baseline and percentage change = (current investment − baseline) / baseline × 100, for a positive valid baseline. These formulas/display choices remain proposals. Applying them to channel-total rows gives:

| Marketing channel | Current investment | Prior-year baseline | Absolute change | Percentage change |
| --- | ---: | ---: | ---: | ---: |
| TV | R$1,600,000 | R$1,550,000 | +R$50,000 | +3.23% |
| YouTube | R$500,000 | R$300,000 | +R$200,000 | +66.67% |
| Meta | R$750,000 | R$600,000 | +R$150,000 | +25.00% |
| Google Search | R$600,000 | R$650,000 | −R$50,000 | −7.69% |
| TikTok | R$250,000 | Missing (`null`) | Unavailable | Unavailable |

Research-table formatting is not the final Portuguese UI format. All four known channel baselines equal their vehicle-detail sums: TV 1,100,000 + 450,000; YouTube 300,000; Meta 350,000 + 250,000; Google Search 650,000. TikTok's total and detail both have null baseline. No baseline/current amount is zero or negative in the fixture. Selection must remain `vehicle === null`: details describe the same money and must not be added again. Do not introduce an overall change comparing the full current total with an incomplete historical total; the requirement is per channel.

## Missing and defensive cases

Propose preserving separate outcomes rather than coercing them to zero:

- Null baseline: historical investment is missing; neither change is known. TikTok is this real case, not a measured zero or a new-channel conclusion.
- Zero baseline: absolute change remains current − 0, but percentage is unavailable, including 0/0. Explain the zero comparison base rather than display Infinity or invent a percentage. This is defensive coverage.
- Positive baseline and zero current: absolute change is −baseline and percentage is −100%; unchanged positive amounts give 0%.
- Negative baseline: invalid investment reference; propose unavailable comparison with an explicit reason. Non-finite values/wrong types are malformed payloads. Negative current investment is also absent today; any policy for it should be explicit rather than inferred as a marketing result.

Increase/decrease indicates spending direction, not performance improvement. Avoid automatically marking increased spending as good or decreased spending as bad. UI presentation and exact unavailable labels await design discussion.

## Incremental code boundaries

[Architecture](../../docs/architecture.md#chosen-responsibility-boundaries) and [code patterns](../../docs/code-patterns.md) already separate transport, pure calculations, React lifecycle, and presentation.

- `src/api-validation.ts::parseData` deliberately casts baseline without runtime checks because Task 01 did not consume it. `ContributionRow` already declares `number | null`, but that declaration does not make current payloads safe. Proposed extension: validate finite number or explicit null at the API boundary; preserve zero/negative numbers for a documented semantic policy. Missing property/string/non-finite values should not silently become zero or null. Rejecting malformed baselines would now fail the combined panel through existing contract-error handling; this is a deliberate proposed consequence to record, not existing behavior.
- `src/chart-data.ts::ChartPoint` contains investment/contribution/ROI but no baseline. Raw validated rows remain available in `DashboardWorkspace` through the existing successful response. No new endpoint, fetch, hook, dependency, or response-cache is needed.
- Option A (recommended): add a small pure channel-investment comparison helper consuming raw rows and returning channel/current/baseline/changes plus an unavailable reason. Keep it in a focused module with colocated tests; reuse the existing total-row selection rule without creating a general aggregation layer. Existing chart points stay focused on the supplied charts.
- Option B: extend channel points with baseline/comparison values. This shares traversal but expands a chart-specific shape and may burden vehicle points with unused fields. Use only if the chosen UI actually consumes that shared model; do not calculate separately in JSX.
- `src/DashboardWorkspace.tsx` can render a focused comparison component from the already-successful response; `src/DashboardCharts.tsx` currently loops over agent-defined charts only. Prefer treating the client-requested comparison as an explicit dashboard addition instead of fabricating another agent ChartSpec or broadening the chart engine. Placement/table/bars/cards remain design choices.
- `src/format.ts` can supply consistent Portuguese currency and signed-change formatting. Existing `formatShare(value, total)` takes a value and its total and formats their ratio as a percentage; make percentage-point versus fractional units explicit to avoid multiplying by 100 twice.

Preserve `useDashboard` parallel validated loading, cancellation/retry, skeletons, and post-success reveal. Keep the navbar, fixed floating composer, measured end clearance (`useComposerClearance`), desktop/narrow layouts, and reduced-motion behavior. Any added section must remain fully scrollable above the composer; do not redesign Task 01's charts.

## Validation proposal and limits

At the time of the initial research, Task 01 had 14 passing tests for chart data and API loading. The last confirmed result after the external-review fixes is 28 passing tests, as recorded in [Testing](../../docs/testing.md); no tests were rerun for this documentation update. Add focused unit cases after policy adoption: all five fixture outcomes, increase/decrease/no change, positive baseline with zero current, null versus zero baseline, negative/invalid reference, non-finite results, no detail double counting, and input immutability. Add API cases for finite/null baseline acceptance and malformed baseline rejection if that boundary policy is adopted. Restore fetch stubs and use small payloads; no huge snapshots, coverage quota, integration/E2E suite, or UI harness.

Later implementation should run `pnpm typecheck`, `pnpm lint`, and `pnpm test`; no build. Manually inspect comparison meaning, unavailable labels, keyboard-readable exact values, responsive width, reveal and final composer clearance. Unit tests do not prove those UI properties.

Research performed: current source/fixture inspection and read-only arithmetic. No online lookup was needed for these contracts and elementary calculations. No technical blocker prevents planning; formula, missing/zero policy, malformed-baseline failure scope, and presentation are proposals to review with the Task 02 design/plan, not mandatory separate approval steps. No source, tests, Task 01 records, shared docs, or Git state were changed for this research.
