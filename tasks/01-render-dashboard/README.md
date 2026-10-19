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

## Channel and vehicle in the supplied data

`channel` means **marketing channel**, not necessarily a TV station: the channels are TV, YouTube, Meta, Google Search, and TikTok. `vehicle` provides detail within a channel, such as Globo/SBT within TV and Facebook/Instagram within Meta.

In [the fixture](../../server/contribution-rows.json), rows with `vehicle: null` represent channel totals; named vehicles detail those same totals. TV investment is R$1.6 million, already composed of Globo's R$1.2 million plus SBT's R$0.4 million. Adding the TV total to those details would count the same investment twice (R$3.2 million).

Chart breakdowns therefore describe different granularities: `channel` compares marketing channels, while `vehicle` compares their detailed vehicles. Using total rows for channel charts and detail rows for vehicle charts is a suggested interpretation, not an approved implementation decision; selection/aggregation remains open below.

## Pending decisions

The primary UI direction is chosen: top Media Hero navbar, floating composer fixed at the bottom independently of scrolling, workspace above, skeletons during requests, and gradual title/chart reveal after both responses succeed. Reserve sufficient scroll clearance for the final chart and source to be fully visible above the composer, including on mobile. The earlier image's top-form layout is a chart reference only. This direction does not require reapproval; the items below concern remaining details.

Read the [design direction](design.md) for the user-confirmed bottom composer, workspace above, and progressive presentation. Read the [decision brief](decision-brief.md) for verified figures and proposed defaults, and [research](research.md) for supporting investigation. These records do not authorize implementation.

- How to select/aggregate total and detail rows for each breakdown, and handle undefined ratios.
- Option 1's layout is chosen: two desktop columns, first chart full-width, subsequent cards in API order, and one column on mobile; see [design](design.md). Exact chart dimensions, formatting, request coordination, and loading/error mechanics remain implementation details within the confirmed direction, including fixed bottom composer positioning and sufficient content clearance.

Unit verification planning is recorded in the [testing strategy](testing-strategy.md); it is not evidence of executed checks.

## Review and validation results

- Review: Not performed; findings and resolutions not yet recorded.
- Validation: Not run; commands, scenarios, and results not yet recorded.
- Acceptance evidence: None yet.

Use the [task procedure and references](../README.md) for implementation/review guidance and [Architecture](../../docs/architecture.md#supplied-contracts-and-unresolved-handling) for fixture constraints.
