# Task 01 code review

Status: Review only; no code was changed. Reviewed commit `c16ce75` with a clean working tree.

## Verdict

The code is solid and deliverable. Task 01 acceptance is met, and no defect breaks the current flow with the supplied fixtures. The findings below are robustness risks, test gaps, and readability points.

## Checks performed

- `tsc --noEmit`, `eslint . --max-warnings 0`, and `vitest run` (14 tests) pass.
- A temporary ESLint run with the [quality gates](../../docs/quality-gates.md) thresholds reported, above target but below maximum: `getJson` complexity 9, `submit` 7, `ChartCard` 6. The outer `describe` callback in `src/api.test.ts` has 62 lines (maximum 60). All of these exceptions are already recorded in the deliverable records.
- The application was not opened in a browser during this review.

## Strengths

- **No double-counting:** channel totals (`vehicle: null`) and vehicle details are selected separately without mixing granularities. Tests confirm equal sums in both views and unchanged input.
- **Unavailable ROI differs from zero:** without valid investment, ROI shows "Indisponível". Zero sales with positive investment stays zero.
- **Robust loading:** both requests run in parallel and the panel appears only when both arrive and match. A stale response cannot overwrite a newer one, and a failure cancels the sibling request. Network, HTTP, JSON, and contract errors stay distinct, and each message names the failing service.
- **Clear responsibilities:** pure calculations in `src/chart-data.ts`, formatting in `src/format.ts`, effects in `useDashboard`, and presentation in components.
- **Accessibility care:** keyboard-accessible exact-value tables, `prefers-reduced-motion` support, and a note that ROI is not profit.

## Medium-priority findings

1. **An unknown chart breaks the whole panel.** `src/api-validation.ts` accepts only the three exact combinations `bar/roi/channel`, `bar/investment/vehicle`, and `pie/contribution/channel`. If the agent returns a fourth chart, the manager sees "informações incompatíveis" and loses the three charts that would render. This is within the declared scope (no general-purpose renderer), but it is a product decision. Explain it in `DECISOES.md`, or skip only the unsupported chart and show a notice.
2. **The no-double-counting rule is assumed, not verified.** `chartData` trusts that each channel has exactly one total and that details sum to it. Nothing detects a channel without a total row (it would silently disappear from channel charts) or a duplicated total (it would double-count again). The current fixture is consistent, but a source change would fail silently, contrary to the guideline of not turning missing data into success.
3. **`baseline` passes unvalidated through a type cast.** `parseData` returns `r.baseline as number | null`. This is irrelevant for Task 01, but Task 02 consumes the field and the type promises `number | null` without guarantee. Validate it as a finite amount or `null` before use.
4. **The most delicate logic has no tests.** Attempt races, stale-response protection, retry with the failed question, and abort on unmount live in `useDashboard` and were verified only manually in the browser. `failureMessage` and `src/format.ts` are also untested. The limitation is declared, but it is the largest blind spot in the suite.

## Low-priority findings

- **Fixed tooltip label.** In `Bars`, the tooltip shows "Investimento" for any non-ROI metric. It is correct today only because validation blocks contribution bars; relaxing that restriction would mislabel values.
- **`Number(value)` coercion in tooltips.** `Number(null)` becomes 0 and would display "R$ 0,00 / R$ 1". Recharts' default null filtering should prevent this, but the coercion contradicts the care taken to separate unavailable from zero.
- **ROI axis outside the locale pattern.** The tick formatter `` `${value}×` `` would show a decimal point instead of a comma and uses a unit different from the tooltip and table ("R$ x / R$ 1").
- **Share rounding.** Pie shares sum to 100.1% (35.6 + 14.9 + 20.8 + 23.8 + 5.0). Minor, but an attentive manager may notice.
- **Imprecise error message.** A period mismatch raises an error with endpoint `"/api/agent + /api/data"`, and `failureMessage` attributes it to the panel specification.
- **Literal question comparison.** `agent.question !== question` requires the agent to echo the question exactly. It works with the mock but is fragile with a real agent that normalizes text.
- **Accessibility:**
  - `role="status"` messages mount together with new content; some screen readers do not announce newly inserted live regions, and actual screen-reader speech remains unverified.
  - `aria-busy` sits on an `aria-hidden` element, where it has no effect.
  - Clicking "Tentar novamente" unmounts the button, so focus falls back to `body`.
- **Compressed formatting** that the quality gates discourage:
  - several fields per line in `src/api-validation.ts`;
  - the whole navbar on one line in `src/App.tsx`;
  - JSX lines longer than 120 characters in `src/DashboardCharts.tsx`.

## Recommendation

Before delivery, prioritize explaining finding 1 in `DECISOES.md` and validating `baseline` (finding 3) before starting Task 02. Finding 2 also fits the challenge's request to discuss data problems: a simple check that details sum to totals, with a visible notice when they do not, would be a good point for the follow-up conversation.
