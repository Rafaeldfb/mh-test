# Task 02 implementation plan

Status: Complete; all three deliveries implemented, validated and clean-reviewed. Preparing this plan does not authorize implementation or Git operations. The [task acceptance](README.md#observable-acceptance) and [confirmed policies](decision-brief.md#confirmed-calculation-and-historical-data-policy) are settled; technical defaults below make later execution concrete.

Coordinator review verified sequence, dependencies, execution context and decisions, including the Recharts visual-orientation/layout distinction and precedence of the selected defaults. No code or tests were executed during planning review.

## Sequence and inputs

Task 01 already supplies validated responses, pure chart transformations, three charts, loading/error/retry, and fixed-composer clearance. Reuse them; no server, ChartSpec, dependency, or fetching-lifecycle changes are needed. Read this index, then only the selected delivery and its linked prerequisites.

| Order | Delivery | Dependencies | Reviewable output | Status |
| --- | --- | --- | --- | --- |
| 01 | [History and comparison data](deliverables/01-comparison-data.md) | Current parser/types, fixtures, unit tests | Safe historical classification, pure channel comparisons and percentage formatter, with unit evidence | Complete |
| 02 | [Grouped-bar comparison card](deliverables/02-comparison-card.md) | 01's comparison contract | Responsive, accessible card ready for integration; no public invitation yet | Complete |
| 03 | [Offer, activation and reset](deliverables/03-comparison-flow.md) | 01 and 02; existing success workspace | Complete invitation → skeleton → grouped bars, cleanup and Task 02 acceptance evidence | Complete |

These slices are independently reviewable, not dependency-free. 02's component is intentionally not a complete user flow; 03 mounts it in the actual workspace. No separate administrative verification delivery is needed.

## Technical defaults for execution

- **History:** keep the received baseline as `unknown` in decoded rows, replacing the unchecked numeric cast. One pure classifier narrows positive/zero/missing/invalid history before arithmetic. This preserves raw payloads without weakening validated current amounts; no ChartPoint expansion or duplicated derived state. See [01](deliverables/01-comparison-data.md#scope-and-outputs).
- **Calculation:** select channel totals only. Return fractional change `(current - baseline) / baseline`; format through Intl percent, exactly two pt-BR decimals, signed direction and 0,00% for unchanged amounts. Omit optional absolute differences and aggregate annual change. Missing/invalid/zero references and overflow degrade only the affected comparison; essential contracts/integrity retain existing errors.
- **Card:** use existing CSS/Recharts outside the agent chart loop, vertical bars above 720px and horizontal at/below it. This reuses the current responsive boundary; verify label fit. Include current/prior-year period labels and precise accessible value text, using lists/details rather than a comparison table. See [02](deliverables/02-comparison-card.md#scope-and-output).
- **Flow:** local success-only child state resets when a new query unmounts it. Hide the accepted offer immediately while retaining space; guard duplicate activation. Focus the stable card heading, scroll instantly to its skeleton, and reveal using only the cancellable frames necessary for a paint, without fixed delay. Explicitly cancel all queued work and invalidate callbacks on reset/unmount; reduced motion removes unnecessary staging. See [03](deliverables/03-comparison-flow.md#scope-and-technical-choices).

These delegated defaults do not reopen product policy. Equivalent simplifications need a recorded reason, not another routine approval. [Design text](design.md) overrides static references, particularly invitation hiding. No new endpoint, fetch hook or generic state/layout framework.

## Execution, review and evidence

After authorization, execute one delivery at a time in the main implementation chat. Follow [the implementation/review loop](../../.agents/prompts/implementation-loop.md): reviewer subagent `gpt-6.1-sol`, reasoning `high`, after each slice; adjudicate findings, correct and re-review until no unresolved findings before advancing. No recursive delegation or reviewer dispatch during this planning work.

Use focused Vitest cases during changes, then `pnpm typecheck`, `pnpm lint`, and `pnpm test` at meaningful delivery handoffs. Preserve 28 existing regressions. Record measured [quality gates](../../docs/quality-gates.md), actual validation, findings/dispositions and gaps in each delivery; synchronize task/index statuses. See [unit strategy](testing-strategy.md) for manual limitations. No build, integration/E2E or UI harness.

Complete Task 02 only when 03 evidences [all acceptance](README.md#observable-acceptance), including unavailable-history isolation, orientation, hiding, stale-work cleanup and composer clearance. Unit assertions do not prove UI/lifecycle behavior.

Out of scope: Task 01 redesign, backend/chat, images/dependencies, final `DECISOES.md`/submission screenshot, journal and Git mutations. Metadata contracts remain while the technical footer stays hidden. QA captures are review evidence only.
