# Year-over-year investment decision brief

Execution update: Task 02 is implemented and clean-reviewed; see [current results](README.md#review-and-validation-results). The preparation notes below retain their original planning context.

Preparation snapshot: User-confirmed data and interaction policies; Task 02 not started. See [design](design.md) for presentation and lifecycle decisions. The [plan defaults](plan.md#technical-defaults-for-execution) now resolve technical modeling and execution choices; this record does not authorize implementation.

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

## Confirmed calculation and historical-data policy

- The chosen content includes current investment, baseline, and percentage change (`(current - baseline) / baseline * 100` when baseline is positive). Absolute difference (`current - baseline`) was originally considered optional; the [selected plan](plan.md#technical-defaults-for-execution) omits it for the first implementation. Percentages enable relative comparison; currency amounts explain scale.
- Preserve distinct historical outcomes: valid positive amount, missing (`null`), invalid (including wrong type, negative/non-finite value, or absent field), and valid zero. Missing or invalid history makes comparison unavailable **only for that channel**; preserve its valid current investment and the other charts. Omit its historical bar and percentage, and explain the outcome without fabricating zero.
- Historical zero is a valid amount, as is current zero. Show the amounts, but explain that a zero baseline prevents percentage calculation, including 0/0; do not show Infinity or invent 100%. Zero current investment with a positive baseline yields −100%; unchanged amounts with a positive baseline yield 0%. These are defensive cases, not current fixture facts.
- Omit an aggregate annual comparison: it is not requested, and TikTok makes the all-channel historical baseline incomplete. Comparing all current spending against only known baselines would mislead.
- Keep calculations pure and separate from formatting/rendering. The current [API parser](../../src/api-validation.ts) passes baseline through without runtime validation, and [chart points](../../src/chart-data.ts) omit it. Classify historical-field quality without turning an invalid baseline into a whole-panel contract error. HTTP/transport failures and other essential-contract/integrity failures retain existing panel error/retry behavior. This baseline-specific exception does not relax current-data validation or integrity rules. Use the [selected modeling defaults](plan.md#technical-defaults-for-execution) for execution; no new endpoint is needed.

## Chosen interaction and presentation

Follow the [confirmed agent offer and comparison action](design.md#confirmed-flow) after the three existing charts, then scroll to the new card's skeleton and reveal its comparison. This resolves the placement/trigger ambiguity; adding columns to existing ROI details is no longer the primary direction. The offer is the candidate's confirmed UX choice, not mock NLP or a requirement to send another request.

The user rejected the table and chose grouped bars for continuity with the dashboard: two adjacent investment bars per marketing channel, current versus the same period last year. Amounts and percentage changes must be readable in labels and accessible tooltip/detail content. For TikTok, omit the historical bar and explain that comparison is unavailable; do not fabricate zero history. The numerical table above is reference arithmetic for this document, not a UI recommendation.

Use signed changes and explicit period labels; color must not imply that increased spending is good or decreased spending is bad. Preserve Portuguese formatting and the [design constraints](design.md#comparison-content-and-constraints), including composer clearance. Hide technical dataset/model text below the cards while retaining source metadata/contracts and documented provenance. No change to the agent's three chart specifications is needed. See the current [v2 design references](design.md#visual-state-references).

See [research](research.md) for implementation investigation and the [task record](README.md#decisions) for decision tracking. No calculations, UI changes, tests, or runtime validation were implemented for this brief.
