# Task 02 unit testing strategy

Execution update: Task 02 is implemented and clean-reviewed; see [current results](README.md#review-and-validation-results). The preparation notes below retain their original planning context.

Preparation snapshot: Plan only; no tests implemented or executed here. Use existing Vitest for unit tests, with no new dependencies or UI harness. The [task acceptance](README.md#observable-acceptance), [confirmed historical policy](decision-brief.md#confirmed-calculation-and-historical-data-policy), and [design](design.md) govern expectations; this strategy does not authorize implementation or create an implementation plan.

## Existing baseline and numeric contract

[Current coverage](../../docs/testing.md#existing-coverage) records 28 tests across five files: API/combined loading, chart transformations, channel integrity, contextual errors, and ROI tick formatting. Preserve these regressions. There are no comparison helpers or tests yet. `src/api-validation.ts` currently casts baseline unchecked; `ContributionRow` claims `number | null`, while `ChartPoint` omits baseline. The later implementation must model historical quality safely rather than rely on that cast.

The [selected plan contract](plan.md#technical-defaults-for-execution) represents relative change as a **fraction**, `(current - baseline) / baseline`; formatting as percent produces the confirmed `(current - baseline) / baseline * 100` display. For example, 0.25 must format as +25,00%, never +2.500,00%. Declare the unit in helper/formatter contracts before writing assertions. Keep that selected unit consistent across assertions and formatting; do not blindly reuse `formatShare`, which currently formats to at most one decimal.

## High-value unit matrix

| Unit/responsibility | Cases and observable expectations |
| --- | --- |
| Historical classification at the data boundary | Distinguish positive finite amount, valid zero, missing null, and invalid wrong type/negative/non-finite/absent property. Include a numeric string to prevent coercion. Classification preserves a valid current amount; missing/invalid history does not reject the response or convert to zero. Use the selected plan’s unknown-history/classifier boundary. |
| Pure per-channel comparison | Select only `vehicle === null`; produce all five marketing channels once, never sales/ROI or vehicle comparisons. Check fixture values below, immutable input/order, and no aggregate annual result using incomplete history. Details cannot increase the comparison values or supply invented history for a missing total baseline. |
| Local unavailable outcomes | Changing only one baseline to null/invalid leaves its current investment, other channels' comparisons, and Task 01 chart points unchanged. Output retains distinct missing/invalid/zero reasons; no fabricated historical amount or numeric percentage for unavailable history. |
| Formula and defensive boundaries | Increase, decrease, equal positive amounts (fraction 0), zero current with positive history (−1 = −100%), positive current with zero history, and 0/0. Zero history remains a known amount but has no percentage. Negative history is invalid. Overflow/non-finite computed results must be unavailable rather than NaN/Infinity; these are defensive cases, absent from the fixture. Absolute difference tests apply only if that optional feature is implemented. |
| Percentage formatting | Exactly two fractional digits in pt-BR: +3,23%, +66,67%, +25,00%, −7,69%, −100,00%, and 0,00%. Accept the actual formatter's minus glyph, but assert direction and decimal precision. No percentage text for unavailable results. Spending direction carries no good/bad performance conclusion. |
| Essential-contract regressions | Through the existing parser/client seam, malformed baseline alone is channel-local; malformed envelopes, invalid current amounts/contribution, inconsistent periods/question, and current total/detail integrity issues still reject with existing context. Preserve missing/duplicate totals and monetary reconciliation tolerances; do not weaken `data-integrity.ts` to accommodate history. |
| Comparison interaction logic, only if naturally isolatable | If implementation exposes a plain state transition/helper: one activation, preparing/ready progression, no duplicate activation, reset for a new query, and no acceptance of stale completion. If a scheduler is naturally isolated, verify cancellation of pending callbacks. Do not extract an architecture just for tests or claim these assertions exercise React cleanup. |

Fixture oracle (current/baseline): TV 1,600,000/1,550,000 → fraction ≈0.032258 → +3,23%; YouTube 500,000/300,000 → ≈0.666667 → +66,67%; Meta 750,000/600,000 → 0.25 → +25,00%; Google Search 600,000/650,000 → ≈−0.076923 → −7,69%; TikTok 250,000/null → missing history, current retained, no percentage. Use numeric tolerance for repeating fractions and exact assertions for formatted output.

## Minimal doubles and execution criteria

Use fixture rows for reconciliation and small inputs for edge cases; freeze/copy inputs to check immutability. Test pure calculations/classification/formatting directly without fetch mocks. For boundary preservation, reuse `src/api.test.ts` patterns with a stubbed fetch and valid response pairs, keeping current totals/details consistent unless testing integrity rejection. Directly test unknown NaN/Infinity inputs at the classification/parser seam: JSON serialization turns them into null and would test the wrong case. Restore global stubs/mocks after every case. Use fake timers only if actual scheduling exists; no real sleeps or mandatory animation delay. Avoid large snapshots, helper-call mirroring, coverage quotas, or asserting hypothetical filenames.

After authorized implementation, run focused tests while changing behavior, then `pnpm typecheck`, `pnpm lint`, and `pnpm test` per [Testing](../../docs/testing.md#configured-commands). Apply [quality gates](../../docs/quality-gates.md); record actual cases/results/gaps in the task record. Success means implemented unit behaviors pass deterministically, existing regressions remain green, and unavailable history is never a whole-panel failure. No build.

## Limits and later manual evidence

Unit tests alone do not prove the agent bubble/action, reserved hidden space, focus/assistive-technology exclusion, auto-scroll, skeleton-to-grouped-bars reveal, vertical desktop/tablet versus horizontal mobile bars, legible amounts, reduced motion, or fixed-composer clearance. Verify those manually later, including source/model text hidden while metadata contracts remain intact. The comparison uses already-loaded data, not a second request lifecycle.

New queries must discard comparison and pending transitions; a new successful dashboard restores the invitation. Unmount/key reset alone does not cancel timers, animation frames, or scheduled scroll/focus/reveal: implementation needs explicit cleanup on query change and unmount. Manual lifecycle inspection must check stale work cannot reveal/focus an old destination. Isolated state/scheduler tests may support that evidence but cannot prove hook/DOM behavior without a harness. Breakpoint and focus destination remain implementation choices. No integration, E2E, automated browser tests, or new harness are in scope.
