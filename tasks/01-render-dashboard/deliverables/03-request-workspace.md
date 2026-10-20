# 03 — React request flow and workspace

Current display override: the user's [later instruction](../../02-year-over-year-investment/design.md#comparison-content-and-constraints) supersedes the earlier requirement below to display source table/model or keep a source footer visible. Hide that technical text in the UI; preserve API metadata/contracts, validation, and documented provenance. Source-related execution evidence below describes the earlier implementation, not a requirement to restore it. Final-content clearance above the composer still applies.

Status: Complete.

## Goal and prerequisites

Connect a usable question flow to real APIs, with loading, errors, retry, and success metadata. Delivery [02](02-dashboard-loading.md) must supply its combined loader and signal/error contract. Numeric transformations from 01 are not required yet; charts arrive in 04. Existing `src/App.tsx` is still the question-form placeholder at the planning baseline.

Read [interaction states](../design.md#interaction-states), [confirmed direction](../design.md#confirmed-user-direction), [fetch lifecycle](../research.md#fetch-lifecycle-proposal-revised), [plan decisions](../plan.md#adopted-implementation-decisions), and [unit limits](../testing-strategy.md#execution-criteria-and-limits). Consult shared [code boundaries](../../../docs/code-patterns.md#applying-the-chosen-boundaries).

## Scope and observable output

Update `src/App.tsx` and plain CSS; extract a small lifecycle hook and focused components where useful. React calls the loader rather than containing fetch/parsing or business calculations. Use explicit idle/loading/success/error state with submitted-question snapshot. Keep editable text separate. Start on submit/retry, not typing or mount.

Own one controller per attempt. Prevent duplicate pending submissions synchronously as well as through the disabled action. Only the active attempt may commit success/error/finally; invalidate and abort on unmount or supersession. On genuine loader failure, retain its error and abort remaining work; that sibling abort must not hide the original failure. Ignore intentional stale/unmount aborts. Retry uses a fresh controller and the failed question, without loops.

Provide the top Media Hero navbar, floating composer fixed at the bottom, workspace above, and sufficient scroll clearance. Add a visible label, native form/Enter behavior, whitespace rejection, status/error announcements, and retry. Show skeletons until both responses succeed; then show returned title, summary, period, table/model. Use short appearance with reduced-motion support. Leave chart bodies for 04; do not use fabricated values or claim Task 01 complete.

## Acceptance and validation

- The browser can submit, wait, display real metadata, recover from either endpoint failing, and retry without losing question text. No partial response or earlier result is presented as a new answer.
- Duplicate attempts do not start accidentally; stale completions cannot alter current state. Cleanup cancels pending client work and any reveal timers, tolerating StrictMode.
- Add unit cases only for naturally isolated state/attempt functions, if present. Do not extract an artificial framework for testing or claim hook/DOM coverage with existing Vitest alone.
- Manually verify pending/success, each endpoint failure, retry, rapid submission, and pending unmount/remount using development-only inspection/interception. Document method and any unverified lifecycle cases. Mock failure URLs are in [architecture](../../../docs/architecture.md#request-flow-and-current-integration); remove temporary overrides before handoff.

Run the plan's handoff checks. Keyboard/focus, announcements, and composer clearance require manual evidence; automation/integration harnesses are not authorized. 04 expands visual checks with all charts.

Out of scope: charts, new transport policies/packages, conversation history, streaming, annual comparison, or Git actions.

## Execution evidence

Implemented `App`, `DashboardWorkspace`, `useDashboard`, `useComposerClearance`, and plain CSS. One controller per attempt and identity checks protect updates; pending submissions are rejected synchronously. Unmount invalidates then aborts; genuine failure retains context before aborting siblings. Retry uses the failed snapshot, keeping editable text separate. ResizeObserver measures composer clearance; CSS entrances need no timers.

Typecheck/lint/test pass (14 tests). Browser inspection against Vite verified pending and real success metadata, both endpoint failures using temporary `fail=1` request routing, manual retry of the failed question while preserving edited text, whitespace rejection and Enter submission. A temporary browser-only StrictMode hook probe confirmed duplicate calls start only two requests, unmount aborts both, and remount gets fresh requests/controllers (4 starts/4 aborts total). Overrides were restored; no harness/dependency added. At 390×844, no horizontal overflow and source scrolls above the composer. Role/status and focus markup inspected; actual screen-reader speech and physical mobile keyboard remain unverified. Charts intentionally deferred to 04. Reviewer `gpt-6.1-sol` high found the loading live status could be deferred by its busy ancestor; moved `aria-busy` onto the skeleton grid. Re-review clean and focused lint passed. Measured App/workspace/hook/clearance code lines: 32/55/49/19; max function lines: 27/33/30/18; complexity: 3/4/7/2. Submit exceeds the complexity target but stays within 10; guards, identity and failure cleanup remain cohesive.
