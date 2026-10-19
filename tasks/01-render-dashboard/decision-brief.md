# Dashboard decision brief

Status: Chosen design direction with remaining proposed defaults; not implemented.

This brief supports [Task 01](README.md). Approval to save it does not approve every recommendation or authorize implementation. These defaults guide later authorized work; they do not require separate approval for every routine detail.

The chosen primary approach is the [top Media Hero navbar, fixed floating bottom composer, and workspace above](design.md), with loading skeletons and gradual title/chart reveal after both complete responses succeed. Reserve scroll clearance so the final content is fully visible above the composer. This direction is settled; the earlier image's top form is only a historical chart study, not an alternative under consideration.

## Verified fixture facts

Amounts below are in millions of reais; sales means attributed sales (`contribution`). Source: [data fixture](../../server/contribution-rows.json) and [metric contract](../../src/types.ts).

| Marketing channel | Investment (R$ m) | Attributed sales (R$ m) | Sales / investment |
| --- | ---: | ---: | ---: |
| TV | 1.60 | 3.60 | 2.25× |
| YouTube | 0.50 | 1.50 | 3.00× |
| Meta | 0.75 | 2.10 | 2.80× |
| Google Search | 0.60 | 2.40 | 4.00× |
| TikTok | 0.25 | 0.50 | 2.00× |
| Total | 3.70 | 10.10 | ≈2.73× |

The five channel-total rows and seven vehicle-detail rows reconcile for investment and attributed sales, channel by channel. Adding both levels doubles the totals. All current investment values are positive and non-null; invalid ratios are a defensive case, not an observed fixture problem. TikTok's missing prior-year baseline belongs to [Task 02](../02-year-over-year-investment/README.md).

## Proposed data and display defaults

| Decision | Alternatives and recommendation |
| --- | --- |
| Channel values | Use supplied channel totals or sum vehicle details; both agree today. Prefer total rows for marketing-channel charts and detail rows for the vehicle chart, keeping the granularities separate. |
| Combined ratio | Divide summed attributed sales by summed investment; do not average vehicle ratios. Globo is 2.5× and SBT 1.5×: their simple average is 2×, but TV is 3.6 / 1.6 = 2.25×. |
| Invalid ratio | Omit the bar/category or retain its name with “Unavailable.” Prefer retaining the name and explaining unavailability, without drawing a fabricated zero-value bar. |
| Layout (chosen) | Follow [option 1's Task 01 grid](design.md): two desktop columns, first chart full-width, remaining cards in pairs in API order; one column on mobile. Use a simple chart loop and CSS, without ID-based layouts or a layout engine. Preserve the top navbar, fixed floating bottom composer, and sufficient content clearance. Exact dimensions and clearance mechanics remain delegable. |
| Ratio labels | Show a multiplier such as 4.00×, explained as attributed sales per R$1 invested, not profit. Use locale-appropriate separators in the Portuguese UI. |
| Currency and shares | Use compact R$ labels with precise values available in details. Pie shares are each channel's attributed sales divided by the R$10.1m total, not investment shares. |

## Proposed request behavior

Propose fetching the agent specification and data in parallel, keeping each request's specification and data together so old and new results cannot be mixed. Both complete responses must succeed before the frontend progressively reveals real content, following the confirmed [design direction](design.md). Loading skeletons represent waiting, not backend streaming. Error recovery preserves the question; retry mechanics remain proposed. None of this is implemented.

## Confirmed preferences and next use

Keep the current CSS approach and supplied Recharts; Tailwind/shadcn are set aside. The minimal task-record workflow is accepted. No broader framework or design system is implied.

Use [research](research.md) for supporting investigation and the [task record](README.md#pending-decisions) for open decisions. Record choices and reasons there during authorized execution; follow the [shared references](../README.md) rather than duplicating their guidance here.
