# 02 — Year-over-year investment by channel

Status: Not started

## Objective and scope

Add each channel's investment variation against the same period in the previous year to the dashboard, as required by [README](../../README.md). Integrate with [Task 01](../01-render-dashboard/README.md) and use the supplied investment/baseline fields; no additional data service is required.

## Observable acceptance

- The dashboard shows an understandable prior-year investment comparison for every supplied channel, with the comparison period identified.
- Values match the documented formula and channel-level row treatment; total and detail rows are not double-counted.
- Missing baselines, including TikTok's `null`, are distinguished from zero and from a measured change. Any zero-baseline case follows a documented policy without displaying an invalid numeric result.
- Labels and formatting let the manager interpret the change; data limitations and chosen handling are explained.

## Pending decisions

- Choose the display and formula: absolute change (`investment - baseline`), percentage change (`(investment - baseline) / baseline * 100` for nonzero baseline), or both. These are candidates, not an approved policy.
- Decide how to communicate missing and zero baselines, including TikTok; do not assume missing means zero.
- Reuse or align with Task 01's total/detail treatment and decide placement/formatting within its panel.

## Review and validation results

- Review: Not performed; findings and resolutions not yet recorded.
- Validation: Not run; calculation checks, missing/zero-baseline scenarios, and UI results not yet recorded.
- Acceptance evidence: None yet.

Use the [task procedure and references](../README.md) for implementation/review guidance and [Architecture](../../docs/architecture.md#supplied-contracts-and-unresolved-handling) for fixture constraints.
