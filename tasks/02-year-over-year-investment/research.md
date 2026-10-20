# Task 02 implementation research

Execution update: Task 02 is implemented and clean-reviewed; see [current results](README.md#review-and-validation-results). The preparation notes below retain their original planning context.

Preparation snapshot: Research only; Task 02 is not started. The follow-up interaction and grouped-bar format are user-confirmed in [design](design.md); remaining technical recommendations below do not authorize implementation. Scope comes from the [task record](README.md) and [challenge](../../README.md): investment variation for each marketing channel against the same period last year. Task 01 is implemented; preserve its three-chart flow and request behavior, with the explicit correction to hide technical dataset/model text from the UI while retaining metadata/contracts.

## Verified data and proposed calculation

Sources: [rows](../../server/contribution-rows.json), [period](../../server/agent-response.json), and [field contract](../../src/types.ts). Current period is July 1–September 30, 2026. The baseline contract means the same period in the previous year, so this fixture compares against July 1–September 30, 2025; no separate baseline-period response exists.

Percentage change = (current investment − baseline) / baseline × 100, for a positive valid baseline, supports the chosen current/prior-year/percentage content. Absolute change = current investment − baseline remains an optional display recommendation. Applying these formulas to channel-total rows gives:

| Marketing channel | Current investment | Prior-year baseline | Absolute change | Percentage change |
| --- | ---: | ---: | ---: | ---: |
| TV | R$1,600,000 | R$1,550,000 | +R$50,000 | +3.23% |
| YouTube | R$500,000 | R$300,000 | +R$200,000 | +66.67% |
| Meta | R$750,000 | R$600,000 | +R$150,000 | +25.00% |
| Google Search | R$600,000 | R$650,000 | −R$50,000 | −7.69% |
| TikTok | R$250,000 | Missing (`null`) | Unavailable | Unavailable |

Research-table formatting is not the final Portuguese UI format. All four known channel baselines equal their vehicle-detail sums: TV 1,100,000 + 450,000; YouTube 300,000; Meta 350,000 + 250,000; Google Search 650,000. TikTok's total and detail both have null baseline. No baseline/current amount is zero or negative in the fixture. Selection must remain `vehicle === null`: details describe the same money and must not be added again. Do not introduce an overall change comparing the full current total with an incomplete historical total; the requirement is per channel.

## Confirmed historical-field policy

The user confirmed channel-local degradation for history in this take-home; see the [policy brief](decision-brief.md#confirmed-calculation-and-historical-data-policy). Preserve separate outcomes rather than coercing them to zero:

- Null baseline: historical investment is missing; neither change is known. TikTok is this real case, not a measured zero or a new-channel conclusion.
- Zero baseline: absolute change remains current − 0, but percentage is unavailable, including 0/0. Explain the zero comparison base rather than display Infinity or invent a percentage. This is defensive coverage.
- Positive baseline and zero current: absolute change is −baseline and percentage is −100%; unchanged positive amounts give 0%.
- Invalid baseline (wrong type, negative/non-finite value, or absent property): preserve the valid current amount, omit the historical bar and percentage, and explain the channel-local unavailable comparison. Keep invalid distinct from missing history and valid zero. This does not fail the other charts or weaken validation of current amounts or existing integrity rules.

Increase/decrease indicates spending direction, not performance improvement. Avoid automatically marking increased spending as good or decreased spending as bad. Follow [design](design.md) for vertical desktop/tablet and horizontal mobile grouped bars, with signed `pt-BR` percentages to exactly two decimals. TikTok's prior-year bar is absent, with an explicit unavailable comparison rather than a zero-valued historical bar. Exact explanatory wording and breakpoint remain technical choices.

## Incremental code boundaries

The alternatives below record the original investigation. The [selected plan](plan.md#technical-defaults-for-execution) takes precedence for execution: it adopts raw-row comparisons (option A), safe unknown history plus classification, fractional units, and concrete responsive/focus/transition defaults, omitting optional absolute differences. These are no longer unresolved human decisions.

[Architecture](../../docs/architecture.md#chosen-responsibility-boundaries) and [code patterns](../../docs/code-patterns.md) already separate transport, pure calculations, React lifecycle, and presentation.

- `src/api-validation.ts::parseData` deliberately casts baseline without runtime checks because Task 01 did not consume it. `ContributionRow` declares `number | null`, which does not validate runtime history. Classify the historical field without throwing a whole-panel contract error for its wrong type, negative/non-finite value, or absent property. Preserve valid/missing/invalid/zero outcomes; use the selected plan for safe modeling/types. This supersedes the earlier proposal to reject malformed baseline payloads globally. HTTP/network failures, malformed response envelopes, current-data contracts, and existing integrity failures still use the panel's error/retry path; the exception is specific to history.
- `src/chart-data.ts::ChartPoint` contains investment/contribution/ROI but no baseline. Raw validated rows remain available in `DashboardWorkspace` through the existing successful response. No new endpoint, fetch, hook, dependency, or response-cache is needed.
- Option A (recommended): add a small pure channel-investment comparison helper consuming raw rows and returning channel/current/baseline/changes plus an unavailable reason. Keep it in a focused module with colocated tests; reuse the existing total-row selection rule without creating a general aggregation layer. Existing chart points stay focused on the supplied charts.
- Option B: extend channel points with baseline/comparison values. This shares traversal but expands a chart-specific shape and may burden vehicle points with unused fields. Use only if the chosen UI actually consumes that shared model; do not calculate separately in JSX.
- `src/DashboardWorkspace.tsx` can render the chosen offer after `DashboardCharts` and reveal a focused grouped-bar comparison card from the already-successful response. Keep this explicit addition outside the agent ChartSpec loop. Reuse installed Recharts for two adjacent bars per marketing channel, with a period legend, legible values/change percentages, and accessible tooltip/detail content. Preserve null baselines so no fabricated historical bar appears. Local activation/reveal state is sufficient in principle; do not add a fetch or a second request hook merely to show a skeleton.
- `src/format.ts` can supply consistent Portuguese currency and signed-change formatting. Existing `formatShare(value, total)` takes a value and its total and formats their ratio as a percentage; make percentage-point versus fractional units explicit to avoid multiplying by 100 twice.

Preserve `useDashboard` parallel validated loading, cancellation/retry, skeletons, and post-success reveal. Keep the navbar, fixed floating composer, measured end clearance (`useComposerClearance`), desktop/narrow layouts, and reduced-motion behavior. Any added section must remain fully scrollable above the composer; do not redesign Task 01's charts.

The [confirmed follow-up](design.md#confirmed-flow) uses automatic scrolling, a preparation skeleton, and local reveal. Hide its invitation without replacing text or collapsing reserved space; prevent duplicate activation. A new query discards comparison and pending transitions; successful new results restore the invitation. Clean up on query change and unmount, including scheduled reveal/scroll/focus work, so stale callbacks cannot affect the new dashboard. The selected plan supplies timing/focus defaults with delegable implementation parameters; no artificial delay or backend wait is required. Respect reduced motion and existing panel loading/error behavior.

## Validation proposal and limits

No tests were rerun for this alignment; [Testing](../../docs/testing.md) records earlier Task 01 evidence. The [unit testing strategy](testing-strategy.md) now records planned coverage and limits. Relevant inputs for it include fixture results, missing/invalid/zero history distinctions, valid current-data preservation, unchanged essential failure behavior, calculation purity, two-decimal formatting, and query/unmount transition cleanup. Malformed historical fields must not be tested as whole-panel rejection. This investigation supports that strategy; it does not authorize tests or a UI harness.

Later implementation should run `pnpm typecheck`, `pnpm lint`, and `pnpm test`; no build. Manually inspect offer/action, scroll-to-skeleton-to-content, comparison meaning, unavailable labels, keyboard focus and readable values, responsive width, reduced motion, reveal, and final composer clearance. Unit tests do not prove those UI properties.

Research performed: source/fixture inspection and read-only arithmetic, followed by alignment with the confirmed data, responsive-design, and lifecycle policies. No online lookup was needed for these contracts and elementary calculations. Earlier modeling, unit, breakpoint, focus and transition alternatives are resolved by the selected plan; exact sizing and wording remain implementation details. The [implementation plan](plan.md) now selects technical defaults and sequential deliverables; execution was unstarted when this research was prepared. Consult the current [v2 design references](design.md#visual-state-references); text policies take precedence over static-image limitations. No source, tests, Task 01 records, shared docs, or Git state were changed for this research.
