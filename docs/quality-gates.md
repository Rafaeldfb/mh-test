# Quality gates

Apply these guidelines when writing code and reviewing changes. The thresholds are pragmatic local policy for this small take-home project, not universal standards or official ESLint requirements. [README](../README.md) remains the source of product requirements.

| Gate | Target | Maximum / acceptance |
| --- | --- | --- |
| File size | 200 lines or fewer | 300 lines. |
| Function size | 40 lines or fewer | 60 lines; up to 100 for React components dominated by JSX. |
| Cyclomatic complexity per function | 5 or less | 10, using ESLint's `classic` variant. |
| Correctness | Changed behavior verified | No known lint/type errors; focused tests for nontrivial logic where relevant. Report checks actually run and any gaps. |

## Counting and review

- Apply size limits to handwritten code, including tests and configuration. Exclude generated files, dependencies, and lockfiles.
- Count physical lines excluding blank and comment-only lines, including JSX and lines containing both code and comments. Function size includes the declaration and closing line.
- Complexity starts at 1 and increases with branching constructs. Include conditional expressions, logical operators, and optional chaining as defined by ESLint; counting only `if` statements is insufficient. Measure each function separately, including callbacks.
- Exceeding a target prompts review. Above a maximum, refactor around cohesive responsibilities or record a brief exception and rationale in the change summary/review. The JSX allowance changes only the size limit, not complexity.
- Do not compress formatting or fragment code artificially to meet a number. Keep changes proportional to the challenge and avoid unrelated cleanup.

## Clean code guidelines

Use judgment: these principles should improve clarity without adding unnecessary structure to the take-home.

- Choose names that express intent; distinguish `investment`, attributed-sales `contribution`, and `roi` rather than using ambiguous amounts or returns.
- Give each function/component one cohesive responsibility. Keep calculations, API effects, and presentation distinguishable without imposing new layers or folders.
- Keep calculations pure: return results without mutating input data, and make side effects explicit.
- Represent zero, missing data, loading, and errors distinctly. Do not silently turn missing values or failures into successful results.
- Prefer the simplest clear solution. Extract abstractions for genuinely shared rules to avoid duplication, rather than anticipating hypothetical reuse.

## Current enforcement

These size and complexity gates are review guidelines: `eslint.config.js` does not enable `max-lines`, `max-lines-per-function`, or `complexity`. Passing lint therefore does not establish compliance with these metrics. This document adds no automatic rules, hooks, or CI checks.

Use [Testing](testing.md) for existing verification commands and hook scope. During review, distinguish measured results from estimates and unperformed checks; do not claim a passing gate without evidence.

Metric definitions: ESLint [file lines](https://eslint.org/docs/latest/rules/max-lines), [function lines](https://eslint.org/docs/latest/rules/max-lines-per-function), and [cyclomatic complexity](https://eslint.org/docs/latest/rules/complexity). These references explain measurement, not the locally chosen thresholds.
