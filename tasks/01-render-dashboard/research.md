# Task 01 implementation research

Research only; no dashboard implementation authorized. Confirmed interaction direction belongs in [design.md](design.md); other product choices and alternatives remain in [decision-brief.md](decision-brief.md), and scope and acceptance in [README.md](README.md). A separate fetching layer is also user-confirmed below. Remaining implementation details are proposals, not authorization to execute them.

All implementation proposals below serve the chosen primary direction: bottom composer, workspace above, skeletons during requests, and gradual title/chart reveal after both responses succeed. The former top-form layout is not a competing approach; only its chart presentation remains useful as visual reference.

## Existing integration points

- `src/main.tsx` mounts `App` inside `StrictMode` and imports plain `src/styles.css`. `src/App.tsx` owns the controlled question field; submission only prevents navigation. API integration, dashboard, loading, and errors are TODOs. The input currently lacks an explicit label.
- `src/api.ts` already exposes `askAgent(question)` and `fetchData()`. It rejects non-2xx responses and parses JSON, but does not validate shapes, retry, or accept cancellation signals. `src/types.ts` defines the response contracts and ROI as attributed sales divided by investment.
- `server/mock-api.ts` returns a fixed specification after 1,500 ms and data after 400 ms. Only the echoed question changes. Both responses use the fixture's period. Either endpoint can independently return 500 after 400 ms through `fail=1`; the failure body misleadingly mentions the agent even for data failures. Missing agent questions return 400.

## Data transformation proposal

Use small pure helpers, without mutating responses: select channel totals (`vehicle === null`), select vehicle details (`vehicle !== null`), and map numeric chart points. Keep calculation separate from display formatting. Do not build a general renderer for every combination permitted by the type unions.

| Supplied chart (`server/agent-response.json`) | Proposed input from `server/contribution-rows.json` |
| --- | --- |
| Bar: ROI by channel | Five total rows; label = channel, value = contribution / investment. |
| Bar: investment by vehicle | Seven detail rows; label = vehicle, value = investment. Use channel + vehicle for identity. |
| Pie: contribution by channel | Five total rows; value = contribution. Derive displayed percentages from their sum. |

Verified totals are R$3,700,000 investment and R$10,100,000 contribution. All five channels reconcile exactly with their detail sums for both fields. Including both granularities doubles both totals. ROI values are TV 2.25, YouTube 3, Meta 2.8, Google Search 4, and TikTok 2. If grouping details instead, divide summed contribution by summed investment; do not average ratios (TV's vehicle mean is 2, but its channel ratio is 2.25).

Every supplied investment and contribution is positive and finite. Invalid denominators are hypothetical: propose an unavailable value with explanation instead of zero/Infinity. Keep that distinct from legitimate zero sales. TikTok's missing baseline concerns Task 02 only; no annual calculation belongs here.

## Confirmed fetching boundary

**Chosen direction:** React calls a function in a separate fetching module. Components must not contain inline `fetch`, HTTP parsing, or substantial request orchestration. Extend the existing `src/api.ts` rather than introducing a generic client framework.

| Responsibility | Minimal proposed placement |
| --- | --- |
| HTTP, JSON parsing, endpoint errors, boundary validation, forwarding `AbortSignal` | Existing `src/api.ts`; no React state or DOM behavior. |
| Parallel specification/data loading and cross-response consistency | A `loadDashboard(question, signal)` function returning one validated pair. Initially it can live in `src/api.ts`; a separate module is useful only if size or cohesion warrants it. This keeps coordination testable outside React. |
| Attempt identity, state, controller ownership, cleanup, submit/retry | A small optional `useDashboard` hook if this logic would crowd `App`. It calls the loader; it does not duplicate transport rules. The controller owner aborts sibling work when the loader rejects, preserving the original failure. |
| Form events and presentation | `App` invokes submit/retry actions and renders state; chart calculations remain in pure transformation helpers. |

These are responsibilities, not three mandatory abstraction layers or one file per function. The separation is settled; exact filenames and hook extraction remain proportional implementation choices. No new library is implied.

## Fetch lifecycle proposal (revised)

**Recommendation:** retain native fetch for this single submit-driven screen and two endpoints. Shared caching, background revalidation, and cross-screen deduplication have no demonstrated requirement here; TanStack Query/SWR would add policy and dependencies without a current benefit. This is a scope judgment, not permission to weaken correctness because the backend is mocked.

**Trigger and coherent state.** Submit/retry handlers invoke the fetching action through the boundary above; typing is not a request. An Effect would fit automatic synchronization to a route/filter, which this flow does not require ([React: events versus Effects](https://react.dev/learn/separating-events-from-effects)). Keep `idle | loading | success | error` state, with an attempt identity and submitted-question snapshot. Commit specification and rows together only after both validate; never combine new metadata with previous data. Parallel `Promise.all` remains appropriate because neither endpoint needs the other's output (about 1.5 s versus 1.9 s sequentially in this mock).

**Duplicates, cancellation, and stale work.** The previous guard-only proposal prevented duplicate starts but did not stop work on unmount. Revise it: allow `AbortSignal` through both API helpers into fetch; allocate one controller per attempt, shared by the pair. Disable duplicate submission and synchronously guard the same pending submission. If a different submission is accepted, invalidate and abort the previous attempt before starting the next. Only the current identity may commit success/error or clear pending state, including in `finally`. This makes latest-accepted-request wins explicit even if cancellation comes too late.

Register unmount cleanup in an Effect that invalidates the active identity and aborts its controller; do not fetch from that Effect. Clear any reveal timers too. Fresh attempts need fresh controllers; cleanup must tolerate StrictMode's setup/cleanup cycle. React documents both [cleanup and stale-response protection](https://react.dev/reference/react/useEffect#fetching-data-with-effects). Cancellation saves client work; identity checks protect correctness. A ref guard alone supplies neither unmount cancellation nor a general stale-result guarantee.

**Failure handling.** Preserve endpoint context and distinguish HTTP non-success, network failure, malformed JSON/invalid payload, and intentional cancellation. Fetch does not reject merely because HTTP is 4xx/5xx ([MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#handling_the_response)). `Promise.all` does not cancel siblings: on a genuine failure, retain the original error and abort remaining work. Do not subsequently mistake that self-initiated abort for a reason to hide the original error. Unmount/superseded attempts remain silent and cannot update state. [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort) can stop fetch/body consumption; it does not guarantee server computation stops.

**Boundary validation and consistency.** `getJson<T>` currently casts JSON; it proves no runtime contract. Propose parsing as `unknown` and small endpoint-specific validators for consumed metadata, period, supported chart combinations, row labels, and finite numeric amounts. Reject malformed/unsupported results explicitly; do not require exact fixture values/counts or a new validation package. Keep valid zero amounts distinct from undefined ratios. Compare period start/end across responses before success, and check the echoed submitted question. Matching periods cannot prove a common backend snapshot: the API has no version/correlation token and `/api/data` takes no specification identifier. Surface mismatches rather than guessing; server snapshot guarantees would require a future contract change. Current fixtures match; mismatch/network/race cases are defensive coverage, not observed defects.

**Recovery and approved visual direction.** Preserve editable question text separately from the submitted snapshot; manual retry repeats the failed snapshot with a fresh controller, without loops or automatic retries. Propose retaining the last successful pair internally, showing skeletons during a new attempt, and never presenting old results as that attempt's answer. Any redisplay must identify the earlier question/period. Follow [design.md](design.md): bottom composer, workspace above, reveal only after both responses validate. Prefer CSS entrances over timers; reduced motion shows content promptly. Label the form, reject whitespace-only input, announce loading/error, preserve keyboard focus, and keep intentional aborts out of visible error feedback. Result-retention details and lifecycle defaults remain proposals, not new design approvals.

## Recharts and presentation

Installed Recharts is **3.10.1**, verified in `node_modules/recharts/package.json`. Exports and props were inspected in `types/index.d.ts`, `types/util/types.d.ts`, and the chart/component/polar declarations under that package.

- Bars: `ResponsiveContainer`, `BarChart`, `XAxis`, `YAxis`, `Bar`, and `Tooltip`. Feed numeric points through `data`, category labels through an axis `dataKey`, and values through `Bar.dataKey`. A shared small bar component can serve the two supplied metrics; use the returned chart titles.
- Pie: `PieChart`, `Pie` with `data`, `dataKey`, and `nameKey`, plus `Tooltip`; provide readable category/value labels rather than relying on color alone.
- Give chart wrappers a definite height and available width, with shrinkable CSS grid/flex children. `ResponsiveContainer` observes size via `ResizeObserver`; percentage height alone cannot create space in an unsized parent. See the official [ResponsiveContainer API](https://recharts.github.io/en-US/api/ResponsiveContainer/).
- Installed Cartesian/Pie declarations default `accessibilityLayer` to true. The official [accessibility guide](https://github.com/recharts/recharts/wiki/Recharts-and-accessibility) describes keyboard navigation and screen-reader caveats. Keep that layer enabled, provide chart headings and an accessible textual value list/table, and verify keyboard behavior rather than assuming the default proves accessibility.

Preserve existing CSS foundations; extend for chart cards and narrow screens without Tailwind/shadcn. Follow the Task 01 layout chosen in [design.md](design.md): option 1, two desktop columns, first chart full-width, remaining cards in API order, and one column on mobile. Loop over `charts`; use simple CSS rather than chart-ID rules, templates, backend positions, or a layout engine. Recharts follows card width; bound heights simply by chart type and category count. Preserve the top navbar and fixed floating bottom composer with sufficient final scroll clearance. Exact dimensions, formatting, and reveal timing remain implementation details; this choice does not approve the data-transformation proposals above.

## Small implementation sequence and validation

1. Add a focused transformation module and colocated Vitest tests for fixture reconciliation, five/seven point selection, no double counting, ratio-of-sums, and hypothetical unavailable ratios. Verify inputs remain unchanged.
2. Extend `src/api.ts` and add the combined loader; connect `App` to its action, optionally through a small lifecycle hook. Render metadata and a focused dashboard component using pure transformations. Keep HTTP and coordination out of JSX; extract files only for cohesive responsibilities, without new packages.
3. Extend Vitest API tests for signal forwarding, each endpoint failing, network/JSON/contract errors, and period mismatch. Existing `src/api.test.ts` only tests question encoding; its `{}` response stub will need a valid response when boundary validation is added. No UI test harness is configured.
4. Use controlled deferred promises for orchestration checks: pending until both resolve, original failure preserved while sibling aborts, stale success/error/finally ignored, and fresh retry. Verify unmount cancellation, StrictMode cleanup, repeated submission, preserved question, and silent supersession in the browser unless a UI harness is separately authorized. Use request interception or temporary local query overrides for `/api/agent?q=test&fail=1` and `/api/data?fail=1`; opening those URLs alone does not test UI handling. Remove temporary overrides before delivery.
5. Check narrow/desktop sizing, long labels, tooltip units, keyboard access, and announcements in the browser. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test`; review size/complexity against `docs/quality-gates.md`. Do not run a build.

Research validation: source/types inspection, fixture arithmetic, and the linked official React/MDN/Recharts documentation only. No implementation, browser checks, or test suite runs were performed for this document. Runtime responsiveness and accessibility remain unverified.
