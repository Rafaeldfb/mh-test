/goal Implement all deliverables, one at a time, using the implementation and review loop below.

## Inputs

Replace the placeholders with repository-relative paths before use. Read the plan and each deliverable's linked prerequisites before implementing it.

- Implementation plan: `<PLAN_PATH>`.
- Deliverables: `<DELIVERABLES_PATH>`, in the plan's order.
- Project instructions: `<PROJECT_INSTRUCTIONS_PATH>`; follow their relevant references.

## Workflow

1. Keep implementation and coordination in this main thread. Implement one deliverable at a time, respecting its scope and dependencies.
2. After each deliverable, invoke a reviewer subagent using model `gpt-6.1-sol` with reasoning effort `high`. Give it the deliverable, relevant context, changed code, and validation evidence. Ask it to review code and check quality gates, tests, type checking, and lint, identifying concrete bugs, errors, and issues.
3. Judge each finding against the code and requirements. Correct valid findings; explain with evidence any finding you reject. You remain responsible for the result.
4. Request another review after corrections, supplying the updated code and finding dispositions. Repeat review and correction in this same main thread until the reviewer returns no unresolved findings. Reviewers must not create another coordinator or delegate recursively.
5. Only then record the deliverable's real implementation, review, and validation results and advance to the next deliverable. Continue until all deliverables have passed this loop.

## Completion

Finish only when all deliverables are implemented and validated with no unresolved review findings. Report completed deliverables and actual test, type-check, lint, quality-gate, and required manual-verification evidence. Do not equate planned or unperformed checks with passing results. If a blocker prevents completion, report the blocker and remaining work rather than claiming success.

Follow the project's existing Git authority boundaries; this prompt does not authorize staging, commits, or push.
