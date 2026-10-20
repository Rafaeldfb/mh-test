# Task 02 design direction

Status: User-confirmed grouped-bar direction; Task 02 not implemented. Technical transition defaults are selected in the [plan](plan.md#technical-defaults-for-execution); exact implementation parameters remain delegable. This record prepares implementation; it does not authorize code changes.

## Product rationale

Investment by marketing channel does not directly correspond to any of the existing three cards. The challenge does not specify whether the extra comparison is requested through chat or an action. The candidate therefore chose an agent follow-up offer. This is a product/UX decision, not a literal requirement of the [challenge](../../README.md) or an NLP capability provided by the mock.

## Confirmed flow

1. After the existing three charts, show an agent speech bubble addressed to the marketing manager: **“Você deseja comparar o investimento por canal com o mesmo período do ano anterior?”**
2. Provide a clear **“Comparar investimentos”** action alongside the offer.
3. Activating it scrolls automatically to the new comparison card, initially showing a skeleton. The transition ends with the comparison content visible.

Hide the follow-up bubble and its action after activation, retaining the same reserved layout space so content does not jump; do not replace the invitation with different text. The user accepts hiding immediately after the click is accepted or by the end of comparison preparation at the latest. Immediate hiding is the recommended simple default, not an explicitly approved exact timing. The invitation must never remain active after completion. Once hidden, it must not accept clicks, receive focus, or be announced to assistive technology. Prevent duplicate activation and move focus from the disappearing action to an appropriate visible comparison destination, respecting reduced motion.

Current and historical investment already arrive in the existing data response. This interaction prepares/reveals local content; it requires no new endpoint, real chat, or presumed additional request. Skeletons must not imply fresh backend activity or invented agent reasoning. No mandatory waiting time is specified.

Starting a new query discards the previous comparison and any pending transition; when the new dashboard succeeds, show its invitation again. Clean up on query change and unmount so an old transition cannot reveal content or move focus in the new dashboard. Keep the panel's existing loading/error behavior.

## Comparison content and constraints

- Compare investment by **marketing channel**, not vehicle, sales, or ROI. Show current investment, the same period last year, and percentage change with clear period labels.
- Use a **grouped bar chart by marketing channel**, with two adjacent bars per channel: current investment and investment in the same period last year. Bars are vertical on desktop/tablet and horizontal on mobile; the technical breakpoint must be justified later. The user chose graphical continuity and explicitly rejected a comparison table as the presentation.
- Make current/prior-year amounts and percentage change readable through labels and accessible tooltip/detail content, with a clear period legend. TikTok keeps its current bar, has no prior-year bar, and explicitly states that the comparison is unavailable; missing history is not zero. A real zero baseline remains distinct and cannot yield a normal percentage change. See [brief](decision-brief.md) for figures and defensive cases. Absolute currency change was optional and is omitted by the selected [plan](plan.md#technical-defaults-for-execution).
- Format valid percentage changes in `pt-BR` with exactly two decimal places and a sign reflecting direction. Missing/invalid history and zero baselines get explanations instead of percentages; valid unchanged positive-baseline investment shows 0,00%. Apply the [confirmed historical-data policy](decision-brief.md#confirmed-calculation-and-historical-data-policy) per channel: retain valid current amounts and the other charts when history is unavailable.
- Remove the technical dataset/model text shown below the cards from the user-facing UI. Preserve source/model metadata in contracts and retain provenance and rationale in documentation; this is a display change, not removal of API fields. Earlier Task 01 source-display guidance is superseded by this explicit user correction.
- Preserve the Media Hero navbar, existing CSS/Recharts, and fixed bottom composer. Keep enough end clearance for the entire final card and its controls to be visible above the composer on desktop and mobile; preserve Task 01's existing flow and charts.
- Respect reduced motion in both automatic scrolling and reveal. Keep the action keyboard-operable and the destination discoverable with accessible focus/status handling; scrolling alone must not leave keyboard users behind. Exact focus mechanics, effects, duration, spacing, and narrow-screen presentation remain implementation details.

## Visual state references

These are the current three sequential states of the same experience, with grouped bars and no technical source/model footer:

1. [Agent invitation](design/state-1-agent-suggestion-v2.png): offer and action after the existing charts.
2. [Chart skeleton](design/state-2-chart-skeleton-v2.png): destination state after scrolling.
3. [Grouped-bar comparison](design/state-3-grouped-bars-v2.png): current/prior-year investment in reais; TikTok has only its current bar, no percentage, and an unavailable-history explanation.

The v2 references show the complete composer; static images do not verify scrolling, animation, focus, or fixed positioning. Implementation must preserve the required spacing and final-content clearance.

## Remaining details

The [plan defaults](plan.md#technical-defaults-for-execution) now select modeling, fractional units, breakpoint, focus and transition mechanics within the accepted hiding window. Those defaults take precedence over earlier open alternatives for execution; exact dimensions and explanatory labels remain delegable. No artificial delay is required. Orientation, two-decimal percentage formatting, query reset/cleanup, and hiding the invitation while retaining its space are settled; duplicate activation is not allowed. Keep technical choices proportional; do not introduce conversation history or a second request lifecycle.

Use [Task 01 design](../01-render-dashboard/design.md) for the implemented foundation, [research](research.md) for technical options, and the [task record](README.md) for acceptance and future evidence. No runtime or visual validation has been performed for Task 02.
