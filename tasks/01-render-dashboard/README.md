# 01 — Render the agent dashboard

Status: Complete — all four deliverables implemented and reviewed.

## Objective and scope

Render the dashboard returned by the agent using the separate data API, with loading and error states, as required by [README](../../README.md). Support the supplied panel; a general-purpose renderer for hypothetical specifications is outside this task. Annual investment comparison belongs to [Task 02](../02-year-over-year-investment/README.md).

## Observable acceptance

- Submitting a question obtains the agent specification and data and renders the panel instead of the empty placeholder.
- The panel presents the returned title, summary, period, and source context (table/model) so the marketing manager can identify what the charts describe.
- The supplied charts render with their specified titles, metrics, and breakdowns: ROI by channel (bar), investment by vehicle (bar), and attributed-sales share by channel (pie).
- ROI uses attributed sales divided by investment, consistent with the contract. Chart values follow a documented treatment of channel totals and vehicle details without double-counting.
- Loading is visible while required requests are pending; a failure from either endpoint is visible rather than silently treated as successful data.

## Channel and vehicle in the supplied data

`channel` means **marketing channel**, not necessarily a TV station: the channels are TV, YouTube, Meta, Google Search, and TikTok. `vehicle` provides detail within a channel, such as Globo/SBT within TV and Facebook/Instagram within Meta.

In [the fixture](../../server/contribution-rows.json), rows with `vehicle: null` represent channel totals; named vehicles detail those same totals. TV investment is R$1.6 million, already composed of Globo's R$1.2 million plus SBT's R$0.4 million. Adding the TV total to those details would count the same investment twice (R$3.2 million).

Chart breakdowns therefore describe different granularities: `channel` compares marketing channels, while `vehicle` compares their detailed vehicles. The implementation adopts total rows for channel charts and detail rows for vehicle charts to avoid double-counting.

## Adopted decisions

The user authorized all four deliverables in sequence, each gated by a clean `gpt-6.1-sol` high review. Channel charts select supplied totals, vehicle charts select details; no aggregation across granularities. ROI is contribution/investment, unavailable for invalid denominators/results. This keeps zero sales distinct from missing ratios. Baseline/year comparison remains Task 02.

Native parallel fetch with consumed-field validation publishes one matching response pair. React owns cancellation and current-attempt checks. Submission is disabled and synchronously guarded while pending. Retry uses the failed question snapshot; editable text survives. Earlier results are hidden during loading/error. No cache or automatic retries are needed for this single-panel flow.

The confirmed navbar/workspace/fixed-composer design is implemented with a measured clearance, skeletons, short CSS entrances and reduced-motion support. The first chart spans two desktop columns; narrow screens use one column. Precise values remain keyboard-accessible through native details tables. See the [plan](plan.md), [design](design.md), and individual delivery evidence.

## Review and validation results

- Deliverable 01: clean gpt-6.1-sol high review; typecheck/lint/test pass (4 tests). Totals and details are selected separately; invalid ROI is unavailable. See [evidence](deliverables/01-chart-data.md#execution-evidence).
- Deliverable 02: clean re-review after fixing discriminant coercion; typecheck/lint/test pass (14 tests). See [evidence and metric exception](deliverables/02-dashboard-loading.md#execution-evidence).
- Deliverable 03: clean review after moving busy state away from live status; checks and browser flow evidence in [delivery record](deliverables/03-request-workspace.md#execution-evidence). Charts integrated in 04.

Use the [task procedure and references](../README.md) for implementation/review guidance and [Architecture](../../docs/architecture.md#supplied-contracts-and-adopted-handling) for fixture constraints.

- Deliverable 04: all observable acceptance implemented and manually inspected; final code and documentation review clean. [Evidence and verification limits](deliverables/04-dashboard-charts.md#execution-evidence) cover responsive charts, keyboard values, request recovery, reduced motion and composer clearance. No build, commit, push, Task 02, final DECISOES or final delivery screenshot included.
