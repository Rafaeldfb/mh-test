# 01 — Render the agent dashboard

Status: Not started

## Objective and scope

Render the dashboard returned by the agent using the separate data API, with loading and error states, as required by [README](../../README.md). Support the supplied panel; a general-purpose renderer for hypothetical specifications is outside this task. Annual investment comparison belongs to [Task 02](../02-year-over-year-investment/README.md).

## Observable acceptance

- Submitting a question obtains the agent specification and data and renders the panel instead of the empty placeholder.
- The panel presents the returned title, summary, period, and source context (table/model) so the marketing manager can identify what the charts describe.
- The supplied charts render with their specified titles, metrics, and breakdowns: ROI by channel (bar), investment by vehicle (bar), and attributed-sales share by channel (pie).
- ROI uses attributed sales divided by investment, consistent with the contract. Chart values follow a documented treatment of channel totals and vehicle details without double-counting.
- Loading is visible while required requests are pending; a failure from either endpoint is visible rather than silently treated as successful data.

## Pending decisions

- How to select/aggregate total and detail rows for each breakdown, and handle undefined ratios.
- Panel layout, formatting, request coordination, and presentation of loading/errors. No implementation or design choice is approved by this record.

## Review and validation results

- Review: Not performed; findings and resolutions not yet recorded.
- Validation: Not run; commands, scenarios, and results not yet recorded.
- Acceptance evidence: None yet.

Use the [task procedure and references](../README.md) for implementation/review guidance and [Architecture](../../docs/architecture.md#supplied-contracts-and-unresolved-handling) for fixture constraints.
