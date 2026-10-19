# Task 01 external-review decisions

Status: Complete — implemented, validated and independently reviewed without remaining findings.

Source: [external review](code-review.md) of `c16ce75`; Cursor/Opus 5.5 provenance was reported by the user. This follow-up judges that report independently and keeps the take-home scope. The original review remains unchanged.

## Dispositions

M1–M4 follow the numbered medium findings; B1–B8 follow the low-priority bullet order, including their subpoints.

| Review IDs | Decision and outcome |
| --- | --- |
| M1 — unsupported chart | Keep atomic rejection of unsupported combinations. Partial rendering is a different product policy. Carry this limitation into the future `DECISOES.md`; do not create a generic renderer. |
| M2 — data integrity | Fixed with a small pure `data-integrity.ts` check called during data parsing. Each channel needs exactly one total. Investment and contribution must match the sum of vehicle details within one cent after both amounts are rounded to cents. Nonzero totals without details also fail this interpretation. Reject the pair with channel/reason context; never silently rewrite or select among conflicting rows. Fixtures reconcile and remain unchanged. |
| M3 — baseline | Deferred to Task 02 before its first consumption. Task 01 still does not validate or use annual baselines. |
| M4 — test gaps | Add focused unit regressions for accepted behavior and error messages. Retain manual lifecycle/focus checks; no new hook, DOM, integration or E2E harness/dependencies. Missing automation alone was not an observed lifecycle bug. |
| B1, B2, B6 — tooltip label/coercion/question echo | Keep current behavior: supported combinations make the bar label correct; installed Recharts filters null tooltip values; the mock contract echoes the question literally. Revisit only with a relevant contract change. |
| B3, B5 — locale/error context | Fixed Portuguese fractional ROI ticks and a specific cross-response period-mismatch message. Keep the compact ratio unit `×`. |
| B4 — share rounding | Keep mathematically correct independent rounding; add a short note that displayed percentages may not sum to 100%. |
| B7a–c — announcements/focus | Status and alert nodes now persist from idle through every request state, with explicit atomic messages. Remove redundant busy semantics from hidden skeletons. Retry focuses the stable question input immediately; responses never move focus. |
| B8a–c — readability | Expand validator objects, navbar and long chart JSX. No formatter dependency, arbitrary 120-character gate or unrelated CSS rewrite. |

The strict M2 error policy is proportional to this supplied two-granularity dataset: all charts and metadata form one response pair, and publishing contradictory totals could mislead the manager. The one-cent allowance handles monetary rounding, not genuine discrepancies. A different source allowing partial vehicle coverage would need an explicit policy change.

## Validation

- `pnpm typecheck`, `pnpm lint`, `pnpm test`: pass, 28 tests across 5 files. Existing Vite native-loader advisory remains; no build.
- Unit regressions cover missing/duplicate totals, both amount discrepancies, absent detail, one-cent acceptance/two-cent rejection, immutable fixtures, API error propagation, contextual messages, and Portuguese ROI ticks.
- Browser inspection: persistent status/alert node identity across idle/loading/success/error; retry by Enter focuses `question`; moving focus elsewhere while pending is respected after success. Actual screen-reader speech remains unverified.
- Temporary request interception reproduced duplicate/missing totals, investment/contribution mismatch and incompatible periods: contextual error and zero chart cards. One-cent discrepancy succeeds. Fractional ratio ticks render `0,4×`, `0,8×`, `1,2×`. Original fixtures recover successfully; overrides removed.
- Narrow viewport inspection checks the added rounding note and source remain scrollable above the composer; this is not a physical mobile-keyboard test.
- Independent `gpt-6.1-sol` high review passed all checks with no code findings. Maximum file code lines: 146. New `validateChannel` and `failureMessage` complexity: 5 each. App is 42 function lines, within the JSX allowance. Existing `getJson`/`submit`/`ChartCard` complexity 9/7/6 stays within 10; the previously recorded 62-line outer API test-suite callback exception remains (it groups small independent tests).

Final code and documentation re-review clean (`gpt-6.1-sol` high). No staging, commits, push, journal changes, Task 02 implementation, new images or final delivery artifacts belong to this follow-up.
