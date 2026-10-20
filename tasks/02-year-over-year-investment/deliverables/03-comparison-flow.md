# 03 — Offer, activation and lifecycle completion

Status: Not started. Execute only after implementation authorization; follow the [plan handoff/review loop](../plan.md#execution-review-and-evidence).

## Goal, dependencies and minimum reading

Complete the public flow from offer to comparison and verify Task 02 acceptance. Delivery [01](01-comparison-data.md) supplies safe points; [02](02-comparison-card.md) supplies the real skeleton/ready card and stable destination. Read their evidence/contracts before integration.

Read [confirmed flow](../design.md#confirmed-flow), [task acceptance](../README.md#observable-acceptance), [plan defaults](../plan.md#technical-defaults-for-execution), and [unit/manual limits](../testing-strategy.md#limits-and-later-manual-evidence). Inspect actual `DashboardWorkspace.tsx`, `useDashboard.ts`, `useComposerClearance.ts`, and CSS. Keep shared [responsibility boundaries](../../../docs/architecture.md#chosen-responsibility-boundaries).

## Scope and technical choices

Mount a small comparison-flow child after `DashboardCharts` only inside the successful workspace. It receives the already-loaded rows/period; no new request, hook for fetching, mock agent step, or ChartSpec. Existing loading/error branches unmount that child on a new query, including resubmission of the same text. New success mounts a fresh invitation; do not key reset solely to the question string.

Use local offered/preparing/ready state with a synchronous duplicate-activation guard. Show the approved speech bubble: “Você deseja comparar o investimento por canal com o mesmo período do ano anterior?” and “Comparar investimentos”. On accepted activation hide the whole offer immediately with its same layout footprint retained; do not replace text, collapse the space, retain a tab stop, or leave an announced/clickable hidden action. A visibility-preserving wrapper can reserve space without a measurement framework.

After the skeleton destination mounts, focus its stable heading (`tabIndex=-1`, prevent implicit scroll), then scroll automatically using instant behavior. This satisfies reduced motion and avoids a separate smooth-scroll cancellation problem. Use only a cancellable animation-frame sequence needed to let the skeleton paint before ready content; no arbitrary timeout or simulated network wait. Reuse short existing CSS entrances, disabled by reduced motion.

Own/cancel every scheduled frame or timer and invalidate stale callbacks on reset/unmount. A component key or unmount resets state but is not cleanup of queued work. Any listeners/subscriptions also need disposal. An old callback must not reveal content, change focus, or scroll after a new query. Preserve persistent dashboard announcements and appropriate comparison status without putting live feedback inside an aria-hidden/busy subtree. Keep scope local; no generalized state machine/scheduler purely for tests.

## Acceptance and verification

- Success shows the offer after three existing charts. One keyboard/click activation scrolls to skeleton then reveals grouped bars; the offer becomes inactive/inaccessible while its space remains. No duplicate card or network request occurs.
- Ready card shows current/prior amounts and correct signed percentages for the five channels. Missing/invalid history affects only its comparison; zero history has its own explanation. Current/essential-contract failures still use the existing global error/retry behavior.
- New query during preparation or after readiness removes comparison and pending work. New success restores invitation; query failure does not. Check identical-question resubmission and pending unmount/remount; focus never lands on an old/hidden control.
- Desktop/tablet orientation is vertical, narrow/mobile horizontal. All content and controls scroll fully above the fixed composer; preserve navbar, prior charts, metadata contracts, and the hidden technical footer. Check reduced motion, readable values, keyboard flow, status feedback and viewport resizing.

Use focused unit tests only where state/scheduling is naturally isolated; otherwise use manual browser inspection and disclose the gap. Verify actual cleanup explicitly, including StrictMode setup/cleanup and stale scheduled callbacks; unit helper tests alone are not proof. Exercise per-channel malformed history and existing API failures with development-only overrides, removed before handoff. No integration/E2E suite or harness.

Run final typecheck/lint/test and measured gate review, then the subagent correction/re-review loop until clean. Record browser sizes, scenario results and unavailable device/screen-reader checks honestly. Mark task complete only when all acceptance is evidenced. Update relevant observed-behavior references during authorized execution; do not rewrite historical Task 01 decisions or the journal.

Out of scope: new images/dependencies, server/chat, aggregate variation, optional absolute differences, final `DECISOES.md`/submission screenshot, staging/commit/push. QA captures are review evidence only.

## Execution and review evidence

Not executed. Record paths, lifecycle/cleanup implementation, actual unit/check/manual results, metrics, findings/dispositions and clean re-review; synchronize task/plan status and disclose remaining verification limits.
