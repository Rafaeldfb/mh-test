# 02 — Grouped-bar comparison card

Status: Not started. Execute only after implementation authorization; follow the [plan handoff/review loop](../plan.md#execution-review-and-evidence).

## Goal, dependencies and minimum reading

Build the real comparison card ready for mounting by 03. Delivery [01](01-comparison-data.md) must supply its safe comparison points and fraction formatter; inspect its execution evidence for exact exports. Existing `DashboardCharts.tsx`, `format.ts`, CSS, and installed Recharts provide patterns, not a reason to extend the agent ChartSpec.

Read [comparison constraints](../design.md#comparison-content-and-constraints), [current static references](../design.md#visual-state-references), [plan defaults](../plan.md#technical-defaults-for-execution), and [manual limits](../testing-strategy.md#limits-and-later-manual-evidence). Apply shared [patterns](../../../docs/code-patterns.md) and [quality gates](../../../docs/quality-gates.md).

## Scope and output

Add a focused comparison card component and CSS consuming 01's points and the supplied period. Keep one semantic heading/destination present in skeleton and ready states for stable focus in 03. The card receives presentation state; fetching and activation/reset effects do not belong in it. Suggested filenames are `InvestmentComparison.tsx` and existing `styles.css`; extract only for cohesive responsibilities.

Use one grouped Recharts bar chart: adjacent current/prior-year bars, no stacking. Visual orientation and the Recharts `layout` name differ: desktop/tablet upright bars use `layout="horizontal"`, categories on X (`type="category"`) and amounts on Y (`type="number"`); mobile sideways bars use `layout="vertical"`, categories on Y and amounts on X. The installed Recharts declarations describe the same category-axis mapping, and existing `DashboardCharts.tsx::Bars` uses vertical layout for sideways bars. Do not copy that layout unchanged for the upright comparison or change the three existing charts. Above 720px use vertical bars; at/below 720px use horizontal bars, reusing the current responsive boundary. A small component-local media query subscription is sufficient for the chart's layout/axes; remove its listener on unmount. No generic viewport framework. Reserve defined responsive chart height and shrinkable width, adapting category labels and accessible values for narrow screens.

Use explicit current and corresponding prior-year period labels from the response period and baseline contract (fixture: July–September 2026 versus 2025). No new backend dates or fetch. Display known monetary amounts and signed two-decimal percentage text. Include a period legend, readable channel/value/change list or native details content beyond hover, and existing chart keyboard support. A comparison table is not the presentation.

TikTok/missing or invalid history retains its current bar; no fabricated historical bar or percentage. Explain missing versus invalid versus zero-reference outcomes. Historical zero is a valid amount with zero-height geometry and explicit text, not missing. Non-finite change preserves valid amount bars and explains unavailable percentage. Use neutral visual encoding: more spending is not inherently better.

## Acceptance and validation

- The component accepts all five outputs from 01 without calculations duplicated in JSX. Existing three chart specifications and cards remain untouched.
- Grouped geometry, period labels, signed two-decimal percentages and unavailable explanations agree with 01 and the policy. Keyboard users can read precise amounts/change without hover.
- Skeleton contains no fabricated values or implied network activity; the same heading survives content reveal. Reduced motion uses existing CSS behavior.

Run typecheck/lint/unit handoff checks and the required clean reviewer loop. Add unit cases only for new pure formatting/data preparation if genuinely introduced; do not claim component/DOM coverage or install a harness. A temporary local mount with the existing loaded response may support manual visual inspection, removed before handoff; otherwise mark rendering/orientation inspection pending until 03. This component is deliberately not a public invitation flow yet.

Out of scope: offer/action state, scroll/focus scheduling, new endpoint, ChartPoint/ChartSpec expansion, extra chart framework, source footer, and Git operations.

## Execution and review evidence

Not executed. Record component inputs/states, paths, unit/check results, measured gates, manual preview method/limits, findings/dispositions and clean re-review. Hand off the stable destination and card interface to 03.
