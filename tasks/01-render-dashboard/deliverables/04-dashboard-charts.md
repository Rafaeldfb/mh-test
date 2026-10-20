# 04 — Charts and responsive completion

Current display override: the user's [later instruction](../../02-year-over-year-investment/design.md#comparison-content-and-constraints) supersedes the earlier requirement below to display source table/model or keep a source footer visible. Hide that technical text in the UI; preserve API metadata/contracts, validation, and documented provenance. Source-related execution evidence below describes the earlier implementation, not a requirement to restore it. Final-content clearance above the composer still applies.

Status: Complete.

## Goal and prerequisites

Complete the three-chart experience in the working request workspace. Delivery [01](01-chart-data.md) supplies tested points and unavailable-value policy; [03](03-request-workspace.md) supplies the coherent success pair, lifecycle, metadata, skeleton/error states, and fixed composer. Read their execution evidence before integration.

Minimum context: [full acceptance](../README.md#observable-acceptance), [chosen layout](../design.md#chosen-task-01-layout), [interaction states](../design.md#interaction-states), [Recharts research](../research.md#recharts-and-presentation), and [unit limits](../testing-strategy.md#execution-criteria-and-limits). Preserve the established responsibility boundaries and [quality gates](../../../docs/quality-gates.md).

## Scope and observable output

Add focused dashboard/chart components under `src/` and extend existing CSS. Use installed Recharts: bars with axes/tooltips and a contribution pie. Render the returned chart list in API order and preserve its titles, metrics, and breakdowns. Reuse 01's calculations rather than recomputing values in JSX.

Follow option 1: two desktop columns, first card full-width, remaining cards paired. Follow option 2 at narrow widths with one column. Use simple CSS, shrinkable cards, defined chart heights, and ResponsiveContainer; avoid ID-based layout rules or engines. Keep source and last chart fully scrollable above the fixed composer, including mobile viewport/composer-height changes.

After combined success, reveal title/text and chart cards progressively with brief CSS entrances; reduced motion shows completed content promptly. This is frontend presentation, not streaming. Maintain skeleton/error/retry behavior. Use Portuguese labels, compact currency with precise accessible values, and ROI described as attributed sales per real invested rather than profit. Pie shares use contribution totals. Retain unavailable categories with explanation without zero bars. Provide readable textual values and keyboard-accessible chart behavior; do not rely on colors/tooltips alone.

## Acceptance and validation

- One question produces title, summary, period, source table/model, bar ROI/channel (five points), bar investment/vehicle (seven points), and pie contribution/channel, using live API responses and no double counting.
- Values agree with 01's fixture evidence; Google Search has ROI 4 and TV investment R$1.6m. Numeric rules stay covered by unit tests, not duplicated in chart snapshots.
- Manually verify desktop/two-column and narrow/one-column layout, resizing, long labels, exact values, keyboard/focus, announcements, reduced motion, loading/reveal, and either-endpoint error/retry.
- Scroll the final chart/source completely above the composer; check narrow viewport and on-screen keyboard where available. Record device/browser limitations rather than claiming universal validation.

Run `pnpm typecheck`, `pnpm lint`, and `pnpm test` after final changes. Review actual size/complexity; passing lint alone does not enforce those gates. Record acceptance evidence/gaps in the task README and update observed-behavior references where implementation changed them. Mark Task 01 complete only when its acceptance is evidenced; leave unresolved failures explicit.

Out of scope: new images/packages, automated integration/E2E/UI harness, Task 02, final challenge `DECISOES.md` and delivery screenshot, commit/push. QA captures may support manual review without being represented as final delivery.

## Execution evidence

Implemented `DashboardCharts.tsx` and `format.ts`; connected charts to `DashboardWorkspace` and extended CSS. The API chart list controls ordering, titles, metrics and breakdowns. Charts reuse pure selected points. Bars include axes and unit-aware tooltips; contribution pie includes non-color-only shares. Native details tables expose precise values and vehicle/channel context. ROI nulls retain categories without zero bars; invalid share totals retain values with an explanation. Dates and numbers use Portuguese formatting.

Typecheck, lint and all 14 tests pass; no build/dependencies/backend/Git actions. Browser inspection against the development server verified:

- Returned metadata, 3 SVG charts in API order, 5 ROI and 7 vehicle values; Google Search 4, TV 2.25, detailed investment R$3.7m, contribution R$10.1m. Exact tables agree with pure-fixture tests.
- Desktop 1440px: two columns, full-width first card; 720/390/320px: one column. No horizontal overflow; open tables wrap. Source remains above composer at maximum scroll (at 390×844: source bottom about 637px, composer top 673px).
- Keyboard ArrowRight activates bar/pie tooltips; Enter opens precise-value details. Input retains focus after Enter submission. Focus outlines and accessible chart names inspected; loading/status and error/alert are present.
- Reduced-motion emulation disables animation. Normal motion uses brief 90/180/270ms card delays after the complete pair, with no timers or chart-library animations.
- Temporary data override with a long channel label and zero investment retained the full unavailable category in the table, rendered 4 rather than 5 bars and caused no overflow at 320px. Overrides removed.
- Final chart workspace still handles either-endpoint failure and manual retry. A data failure cancelled the pending agent request while preserving the data error. Deliverable 03 separately verified synchronous duplicate guard, StrictMode unmount/remount and failed snapshot preservation.

Desktop and narrow full-page QA captures were visually inspected through the browser; they are not the final challenge screenshot. No automated UI suite/harness was added. Actual screen-reader speech, physical mobile keyboard and other browser engines remain unverified.

Reviewer `gpt-6.1-sol` high independently passed all checks and reports no remaining actionable findings. Measured chart/format/workspace/CSS code lines: 96/13/57/78; maximum function lines: 26/3/33; maximum complexity: 6/1/4. ChartCard complexity 6 exceeds the target but stays below 10; its chart selection, unavailable-value explanation and labeling form one cohesive presentation responsibility. Final documentation review clean after correcting stale starter wording and an architecture anchor. Pie tooltip includes the channel name for keyboard navigation.
