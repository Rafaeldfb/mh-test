# 02 — Year-over-year investment by channel

Status: Not started

## Objective and scope

Add each channel's investment variation against the same period in the previous year to the dashboard, as required by [README](../../README.md). Integrate with [Task 01](../01-render-dashboard/README.md) and use the supplied investment/baseline fields; no additional data service is required.

## Observable acceptance

- The dashboard shows an understandable prior-year investment comparison for every supplied channel, with the comparison period identified.
- Values match the documented formula and channel-level row treatment; total and detail rows are not double-counted.
- Valid, missing, invalid, and zero historical amounts remain distinct under the [confirmed policy](decision-brief.md#confirmed-calculation-and-historical-data-policy). Unavailable history affects only that channel's comparison, retaining its valid current investment and other charts; API and essential-contract failures keep existing error/retry behavior.
- Labels and formatting let the manager interpret the change; data limitations and chosen handling are explained.
- Use grouped bars by marketing channel: vertical on desktop/tablet, horizontal on mobile, with legible current/prior-year amounts and signed `pt-BR` percentages to two decimal places. Missing/invalid history has no historical bar or percentage; zero history is a valid amount but prevents percentage calculation.
- Hide internal dataset/model text below the cards while preserving metadata/contracts and documentation. This explicit user change supersedes earlier Task 01 source-display acceptance; it does not require deleting API fields.
- After the three existing charts, the agent offers the comparison with “Comparar investimentos”; activation scrolls to a skeleton and reveals the new card with current/prior-year investment and percentage change. Follow the [confirmed design](design.md), including reduced motion, accessible focus, and final composer clearance.
- A new query discards comparison and pending transitions; its invitation reappears only when the new dashboard is ready. Cleanup also covers unmount. Hide the activated invitation while reserving its space and preventing duplicate activation.

## Pending decisions

Read the [confirmed design](design.md), [data-policy brief](decision-brief.md), and [research](research.md) before later planning. Read the [unit testing strategy](testing-strategy.md) for planned coverage and limits. The [implementation plan](plan.md) indexes three sequential deliverables with technical defaults and review gates. These documents prepare execution; no implementation or tests have started.

- The plan selects simple historical typing/classification, fractional change units, a responsive boundary, and cleanup/focus/transition defaults. Exact sizing and wording remain delegable within the confirmed policies.
- The plan omits optional absolute currency change to keep the first implementation small. See [v2 references](design.md#visual-state-references) for visual context; confirmed text rules govern responsive behavior and data handling.

## Review and validation results

- Planning review: Coordinator review completed; see [plan](plan.md). Implementation review has not been performed.
- Validation: Not run; calculation checks, missing/zero-baseline scenarios, and UI results not yet recorded.
- Acceptance evidence: None yet.

Use the [task procedure and references](../README.md) for implementation/review guidance and [Architecture](../../docs/architecture.md#supplied-contracts-and-adopted-handling) for fixture constraints.
