# Year-over-year investment decision brief

Status: Proposed defaults; Task 02 not started. Saving this brief does not approve its recommendations or authorize implementation.

## Requirement and verified facts

The challenge [README](../../README.md) asks for **investment variation per marketing channel against the same period last year**. Attributed sales and ROI do not enter this calculation. Extend the existing dashboard rather than rebuild Task 01.

The [fixture](../../server/contribution-rows.json) and [contract](../../src/types.ts) provide current investment and `baseline` (prior-year investment), in reais. The current period is July–September 2026; the corresponding comparison is July–September 2025. Select channel-total rows (`vehicle: null`): vehicle details describe the same money and must not be added to these totals.

| Marketing channel | Current investment | Prior-year baseline | Difference (R$) | Change (%) |
| --- | ---: | ---: | ---: | ---: |
| TV | 1,600,000 | 1,550,000 | +50,000 | +3.23% |
| YouTube | 500,000 | 300,000 | +200,000 | +66.67% |
| Meta | 750,000 | 600,000 | +150,000 | +25.00% |
| Google Search | 600,000 | 650,000 | −50,000 | −7.69% |
| TikTok | 250,000 | Missing (`null`) | Unavailable | Unavailable |

Differences and percentages above are calculated reference values, not implemented output. No current channel has zero investment or a zero/negative baseline; TikTok's missing baseline is the actual edge case. Do not infer that it was a new channel or had zero spending last year.

## Proposed calculation and missing-data policy

- Show current investment, baseline, absolute difference (`current - baseline`), and percentage change (`(current - baseline) / baseline * 100` when baseline is positive). Percentages enable relative comparison; currency amounts explain scale.
- For `null`, retain the channel and current investment, label history unavailable, and leave both differences unavailable. Never substitute zero.
- For baseline zero, absolute difference remains calculable, but percentage is unavailable with a zero-baseline explanation; do not show Infinity or invent 100%. Zero current investment with a positive baseline correctly yields −100%. These are defensive cases, not current fixture facts.
- Omit an aggregate annual comparison: it is not requested, and TikTok makes the all-channel historical baseline incomplete. Comparing all current spending against only known baselines would mislead.
- Keep calculations pure and separate from formatting/rendering. The current [API parser](../../src/api-validation.ts) passes baseline through without runtime validation, and [chart points](../../src/chart-data.ts) omit it. Future implementation must validate consumed baselines and preserve missing versus numeric values; no new endpoint is needed. Negative or malformed baselines need an explicit invalid-data treatment, not an invented comparison.

## UI options and impacts

| Option | Benefit and tradeoff |
| --- | --- |
| Add columns/lines to existing channel details | Reuses the ROI card's channel list with little new structure, but hides the requested comparison behind “Ver valores exatos” and mixes investment change with sales efficiency. Vehicle-level details are the wrong granularity. |
| Add one five-channel comparison table/card | Makes the new request visible and keeps its meaning separate from ROI. Requires responsive table/card styling and extra vertical space. **Recommended**, with current/baseline/difference/percentage and a short missing-history note. |

Use signed values and explicit column labels; color must not imply that increased spending is good or decreased spending is bad. Format Portuguese currency and percentages consistently with the current UI. The user has not selected Task 02's placement or presentation.

Preserve existing CSS/Recharts, the fixed composer and final scroll clearance, loading/error flow, success reveal, and narrow-screen behavior from [Task 01](../01-render-dashboard/design.md). A comparison table needs no new chart library or change to the agent's three chart specifications. Its placement/reveal order remains proposed; do not silently promote Task 01's three-card grid into a new requirement for this extra comparison.

See [research](research.md) for implementation investigation and the [task record](README.md#pending-decisions) for decision tracking. No calculations, UI changes, tests, or runtime validation were implemented for this brief.
