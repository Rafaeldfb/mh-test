# 01 — Historical state and comparison data

Status: Complete; implemented and reviewed. Follow the [plan handoff/review loop](../plan.md#execution-review-and-evidence).

## Goal, inputs and minimum reading

Create safe, pure investment comparisons for marketing channels, preserving Task 01's existing behavior. No earlier Task 02 delivery is required. Inputs already exist in [types](../../../src/types.ts), [parser](../../../src/api-validation.ts), [fixture](../../../server/contribution-rows.json), [integrity checks](../../../src/data-integrity.ts), and the current API/chart-data tests.

Read [confirmed data policy](../decision-brief.md#confirmed-calculation-and-historical-data-policy), [plan defaults](../plan.md#technical-defaults-for-execution), [unit matrix](../testing-strategy.md#high-value-unit-matrix), and [shared boundaries](../../../docs/architecture.md#chosen-responsibility-boundaries). Use [code conventions](../../../docs/code-patterns.md) and [quality gates](../../../docs/quality-gates.md).

## Scope and outputs

- Change only historical-field typing/extraction: decoded baseline is `unknown`, preserved from the payload rather than asserted `number | null`. Keep channel/vehicle/current investment/contribution/envelope validation and `validateChannelTotals` intact. Wrong baseline type or absent property must not reject a whole response.
- Add one focused pure comparison module with its classifier, result type and colocated tests. A small discriminated historical result distinguishes positive, zero, null/missing, and invalid (wrong type, absent, negative, non-finite). No coercion and no generic schema/aggregation layer. Derive classification when producing comparison points, not in JSX.
- Select channel totals only (`vehicle === null`) in supplied order. Each output retains channel/current investment, known valid baseline or unavailable reason, and fractional change or its reason. Keep valid historical amounts if only the computed change overflows. Do not modify ChartPoint, calculate ROI/sales, or add overall totals.
- Extend `src/format.ts` with a dedicated fraction-to-percent formatter: pt-BR, two decimals, sign for nonzero direction and 0,00% for unchanged values. Normalize negative zero for display. Keep existing currency/pie/ROI formatting unchanged. Absolute differences are omitted.

## Acceptance and validation

The fixture yields exactly five comparisons: TV +3,23%, YouTube +66,67%, Meta +25,00%, Google Search −7,69%, TikTok missing history with R$250,000 current retained. No detail double counting, baseline fallback from details, or input mutation. Numeric assertions use tolerance for repeating fractions; formatted labels are exact.

Unit cases cover valid increase/decrease/equality, current zero with positive baseline (−100%), zero baseline including 0/0 (known amount, no percentage), null versus invalid/absent/string/negative/non-finite history, and overflow. Changing one historical field preserves all other comparisons and existing chart points. Test unknown NaN/Infinity directly: JSON serialization would turn them into null.

Extend parser/client unit evidence to show malformed history alone loads successfully, while malformed current fields, missing/duplicate totals, reconciliation discrepancies, and existing period/question failures still reject. Reuse existing tests rather than copy them; preserve the rounded-cent integrity rule. Restore fetch globals; no large snapshots.

Run focused cases then the plan's handoff checks and clean subagent review. The output contract is the input to 02/03; record its actual names and unavailable reasons for the next executor. No visible UI, lifecycle, server, dependency, or Git changes belong here.

## Execution and review evidence

Implemented `src/investment-comparison.ts`: `classifyHistory`, `compareInvestments`, `InvestmentComparison`, `HistoricalInvestment`, and `InvestmentChange`. History distinguishes positive/zero/missing/invalid; change is an available fraction or missing/invalid/zero/overflow. Valid amounts survive overflow. Parser/types preserve unknown history; `formatInvestmentChange` formats fractions with two signed pt-BR decimals. No UI or current-data integrity changes.

Validation: typecheck, lint, full Vitest suite pass (41 tests / 7 files); focused new cases pass (13). Fixture arithmetic, immutable total selection, no detail fallback, local degradation, zero/negative/missing/invalid/non-finite history, overflow, formatting and current-field rejection covered. Existing integrity/period/question regressions remain green.

Independent reviewer: gpt-6.1-sol, high; no unresolved findings, independently repeated checks. ESLint measurements (nonblank/noncomment): largest changed file 77 lines, largest function 43 lines (test describe callback), highest classic complexity 6 (classifier). Soft targets exceeded only for cohesive classifier validation and grouped test registration; both below maxima. No build. Browser verification belongs to later UI deliveries.

Final audit follow-up: nonzero fractions that round to zero retain direction (+0,00% / −0,00%), while actual 0/−0 remain 0,00%. Added regression; gpt-6.1-sol high clean re-review independently passed typecheck/lint and 44 tests / 8 files. Updated measured sizes: format 21 code lines, comparison tests 59, largest callback 43, maximum complexity 2 in those two files. No unresolved findings.
