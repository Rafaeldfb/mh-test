# 02 — Year-over-year investment by channel

Status: Complete; all three deliveries implemented and clean-reviewed

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

## Decisions

Read the [confirmed design](design.md), [data-policy brief](decision-brief.md), and [research](research.md) before later planning. Read the [unit testing strategy](testing-strategy.md) for planned coverage and limits. The [implementation plan](plan.md) indexes three sequential deliverables with technical defaults and review gates. Execution results are linked below; the research and strategy retain their planning context.

- The plan selects simple historical typing/classification, fractional change units, a responsive boundary, and cleanup/focus/transition defaults. Exact sizing and wording remain delegable within the confirmed policies.
- The plan omits optional absolute currency change to keep the first implementation small. See [v2 references](design.md#visual-state-references) for visual context; confirmed text rules govern responsive behavior and data handling.

## Review and validation results

- [01 data evidence](deliverables/01-comparison-data.md#execution-and-review-evidence): safe unknown history, pure fractional comparisons, exact percent formatting and preserved integrity. Fixture: TV +3,23%, YouTube +66,67%, Meta +25,00%, Google Search −7,69%; TikTok retains R$250.000,00 with unavailable history.
- [02 card evidence](deliverables/02-comparison-card.md#execution-and-review-evidence): grouped chart, exact values/list, dates, responsive axes and bounded tooltip correction.
- [03 flow/manual evidence](deliverables/03-comparison-flow.md#execution-and-review-evidence): hidden reserved invitation, keyboard focus, skeleton/reveal, duplicate guard, stale-work cleanup/reset, responsive clearance and unavailable-history isolation.
- Each delivery reviewed sequentially by gpt-6.1-sol high; no unresolved findings. Typecheck/lint and all 44 tests across eight files pass. Measured size/function/classic-complexity maxima pass; soft-target rationales are in delivery records.
- Manual Chromium widths: 1440, 768, 720, 390, 320px; keyboard, reduced motion, malformed history, zero/equal/−100%, API failure/retry and cleanup verified. Screen-reader speech, physical mobile keyboard and other engines remain unverified. No build or browser-test harness.
- No aggregate annual change, absolute difference, server/chat, dependencies, final DECISOES.md/submission screenshot or Git operations were added.

Use the [task procedure and references](../README.md) for implementation/review guidance and [Architecture](../../docs/architecture.md#supplied-contracts-and-adopted-handling) for fixture constraints.
