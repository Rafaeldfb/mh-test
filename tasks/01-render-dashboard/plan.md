# Task 01 implementation plan

Current display override: the user's [later instruction](../02-year-over-year-investment/design.md#comparison-content-and-constraints) supersedes the earlier requirement below to display source table/model or keep a source footer visible. Hide that technical text in the UI; preserve API metadata/contracts, validation, and documented provenance. Source-related execution evidence below describes the earlier implementation, not a requirement to restore it. Final-content clearance above the composer still applies.

Status: Complete. All four deliverables implemented sequentially, each with a clean gpt-6.1-sol high review before advancing. No Git actions performed.

## Scope and sequence

Build the supplied three-chart dashboard with metadata, loading, and errors. Keep the existing React/TypeScript, CSS, Recharts, and Vitest stack. The [task acceptance](README.md#observable-acceptance), [chosen design](design.md), and [responsibility boundaries](../../docs/architecture.md#chosen-responsibility-boundaries) govern the work.

| Order | Deliverable | Depends on | Verifiable output | Status |
| --- | --- | --- | --- | --- |
| 01 | [Pure chart data](deliverables/01-chart-data.md) | Existing contracts/fixtures | Correct, immutable chart points with unit evidence | Complete |
| 02 | [API client and combined loader](deliverables/02-dashboard-loading.md) | Existing contracts; 01's unavailable-value policy | One validated response pair or contextual failure, with unit evidence | Complete |
| 03 | [React request flow and workspace](deliverables/03-request-workspace.md) | 02 | Usable submit/loading/error/retry flow and real success metadata | Complete |
| 04 | [Charts and responsive completion](deliverables/04-dashboard-charts.md) | 01 and 03 | All three charts and complete Task 01 acceptance evidence | Complete |

Each document contains only the context needed for its boundary. Later deliveries consume earlier outputs; they are independently reviewable, not dependency-free. The metadata workspace in 03 is an intentional intermediate result, not a completed dashboard.

## Adopted implementation decisions

These defaults, grounded in [research](research.md) and the [decision brief](decision-brief.md), were adopted during authorized execution. Individual delivery records contain reasons, review results and verification limits.

- Channel charts use supplied total rows; vehicle charts use details. Never add both granularities. ROI is sales/investment, or ratio of sums when aggregation actually occurs; no unused generic aggregator.
- Nonpositive/non-finite investment makes ROI unavailable, retaining the category with explanation and no fabricated zero bar. Zero sales with positive investment remains zero. Current fixture ratios are all valid.
- Fetch in parallel with native fetch, validate consumed fields and matching period boundaries, then publish the pair together. Use endpoint context, signal propagation, React-owned cancellation and stale-attempt protection; no cache/framework or automatic retries.
- Disable duplicate submission while pending. Preserve editable text and the submitted-question snapshot; manual retry uses the failed snapshot. Hide earlier results during a new attempt and error rather than implying they answer the new question. Keeping historical results is unnecessary for this single-panel flow.
- Present Portuguese currency/ratio/share labels, precise values in accessible details, and short CSS reveal after success with reduced-motion support.

## Execution and evidence

After authorization, execute one selected deliverable at a time: read its prerequisites and linked sections, inspect the current code, implement only its scope, validate, and record results/gaps in that document. Keep this index's statuses and the [task results](README.md#review-and-validation-results) aligned. Report the completed slice before taking the next; continuation follows the scope of the user's authorization, without automatic Git actions. Do not rewrite the journal.

Use existing unit tests and the [unit strategy](testing-strategy.md); no integration/E2E suite or UI harness. Run focused tests during changes and `pnpm typecheck`, `pnpm lint`, `pnpm test` before handing off each implemented slice; avoid redundant reruns without changes. Apply [quality gates](../../docs/quality-gates.md). No build unless explicitly requested. Browser checks are manual evidence, not unit coverage.

Task 01 is complete only after 04 verifies all returned titles, summary, period, source table/model, bar ROI/channel, bar investment/vehicle, pie contribution/channel, no double counting, and loading/error behavior for either endpoint. Fixed-composer clearance, keyboard access, and responsive/reduced-motion behavior need manual checks.

Task 02, annual baseline calculations, final `DECISOES.md`, and the overall delivery screenshot remain separate. QA captures may support review but are not the final challenge screenshot. No dependencies, new images, backend changes, or generic layout/rendering engine are planned.
