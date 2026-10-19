# Task records

A minimal adaptation inspired by Go-Horse: one durable record per task, not the full framework or a claim of protocol compliance. Scope comes from the challenge [README](../README.md).

| Task | Record |
| --- | --- |
| 01 — Render the agent dashboard | [Objective, acceptance, decisions, results](01-render-dashboard/README.md) |
| 02 — Compare annual investment by channel | [Objective, acceptance, decisions, results](02-year-over-year-investment/README.md) |

## Working procedure

1. The coordinating voice chat confirms the task and acceptance criteria, then routes work to the code or design chat as needed.
2. The executor reads the task record, implements authorized scope, and updates its status and decisions with reasons. Record open questions as pending, not approved choices.
3. Record review findings, resolutions, and validation actually performed in that same task file. Mark complete only when acceptance is supported by results; disclose gaps.
4. Documentation chat maintains shared context; journal chat owns general checkpoints in `journal.md`. Task records do not replace the README's delivery requirements.

Task status does not authorize Git actions. Commit approval follows the [local auto-commit skill](../.agents/skills/auto-commit/SKILL.md); push requires separate authorization.

Consult [Architecture](../docs/architecture.md) for stack and responsibilities, [Code patterns](../docs/code-patterns.md) when implementing, [Design](../docs/design.md) for UI work, [Quality gates](../docs/quality-gates.md) when writing/reviewing code, and [Testing](../docs/testing.md) when validating. Keep evidence and decisions here concise; link instead of copying those references.
