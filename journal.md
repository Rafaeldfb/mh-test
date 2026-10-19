# Checkpoint journal — Media Hero challenge

A simple record for the user and agents to track the work. It may serve as input for the final `DECISOES.md` document required by the README, but does not replace it.

Write future checkpoints in English, as requested by the user. Record the date/time, objective or request, action and outcome, decisions and rationale, checks and pending work. Include only relevant facts; there is no need to record every message.

## 2026-10-19, 16:36 — Understanding and planning

- **Objective:** understand the brief and organize the approach to the challenge. The user intends to delegate development to agents without writing code manually.
- **Action and outcome:** in the original conversation, the assistant read `README.md`, `src/types.ts`, `src/api.ts`, `src/App.tsx`, `vite.config.ts`, `server/agent-response.json`, `server/contribution-rows.json`, and `server/mock-api.ts` and explained the requirements: render the dashboard specified by the API with loading and error states; include the change in investment per channel compared with the same period of the previous year; deliver the code, a short document covering decisions and AI usage, and a screenshot. The brief suggests setting aside up to three hours.
- **Observations from the review, with no handling implemented yet:** the data includes channel totals and details by advertising vehicle, creating a risk of double counting; TikTok has no baseline (`null` does not mean zero); the `roi` metric represents attributed sales divided by investment, not profit.
- **Decision:** create this `journal.md` to record checkpoints and preserve the context of the work. Whether it will be used to compose `DECISOES.md` will be decided later.
- **Checks and pending work:** no implementation or functional validation was performed in the original conversation. Implementation, data-handling decisions, functional validation, and final deliverables remain pending.

Time zone: America/Sao_Paulo (UTC−03:00).

## 2026-10-19, 16:39 — Local Git initialization blocked

- **Request:** initialize a local Git repository in the project root, without staging, commits, remotes, or publishing.
- **Action and outcome:** checked for an existing project or ancestor repository; Git found none. Attempted `git init .`, but it failed when writing `.git/description` because `.git` is on a read-only filesystem. No workaround was attempted.
- **Checks and pending work:** `git status --short` and `git rev-parse --show-toplevel` both failed because no valid repository exists. Initialization and repository-root verification remain pending until `.git` is writable.

## 2026-10-19, 16:40 — Local Git initialization completed

- **Action and outcome:** retried `git init .` through the sandbox's normal elevated-permission mechanism. Permission was granted and the local repository was initialized successfully, resolving the previous checkpoint's blocker.
- **Verification:** `git rev-parse --show-toplevel` confirmed `/HM-test` as the repository root. `git status --short` showed only untracked project files; `git remote -v` returned no remotes. No files were staged and no commits were created.
- **Pending work:** none for the requested local initialization.

## 2026-10-19, 16:41 — Portable paths in shared artifacts

- **Request and decision:** keep personal directory structures out of repository content and shareable artifacts. Use project-relative paths or the illustrative root `/HM-test`; real local paths may be used internally by tools.
- **Action and outcome:** replaced the personal absolute path in this journal with `/HM-test` and added the rule to the root `AGENTS.md`. The `.codex` directory serves as a supporting location, with a short pointer to the root instructions.
- **Verification:** a focused scan of project-owned text files found no remaining personal path references after the correction; Git metadata, dependencies, lockfiles, and generated output were excluded.

## 2026-10-19, 16:44 — Chat responsibilities

- **Decision:** the user assigned coordination to the voice chat and journal maintenance to this chat, “Criar journal do desafio técnico”. Two chats were created: “Código do desafio técnico” for implementation and technical validation, and “Design do desafio técnico” for user experience and interface work.
- **Current stage:** preparation and context review only. No feature implementation has begun and no visual direction has been chosen.

## 2026-10-19, 16:50 — Documentation scope and ongoing coordination

- **Decisions:** keep documentation simple and proportional to the starter in `docs/design.md`, `docs/code-patterns.md`, `docs/architecture.md`, and `docs/testing.md`, based on the README, codebase, and tests. Distinguish observed patterns from unresolved decisions. Use `AGENTS.md` as a short index of general rules and task-specific references, following progressive disclosure.
- **Delegation and reported completion:** the user authorized the specialized chat “Documentação e contexto dos agentes”. Its executor reported completing all four documents and updating `AGENTS.md` with relative references while preserving existing rules. The executor reported reviewing sources, links, anchors, and path privacy; no tests or builds were run and no functional code was changed. This confirms the reported documentation delivery, not functional validation.
- **Ongoing preference:** record relevant coordination discussions and decisions concisely in this journal as a regular part of the workflow, including work beyond code changes, without transcribing messages.

## 2026-10-19, 16:52 — Repository instruction scope corrected

- **User correction:** the global instruction about Next.js builds had been copied into `AGENTS.md` even though this project uses React/Vite. Repository instructions should contain guidance relevant to this project, without importing unrelated global rules.
- **Applied outcome:** the documentation chat removed the Next.js section and reported checking `docs/` and `.codex/README.md` without finding duplicates. The section's removal was also confirmed by reading `AGENTS.md`. No restriction on Vite builds was introduced.

## 2026-10-19, 16:53 — Explicit stack guidance

- **Request and decision:** the user requested an explicit stack reference to prevent technology drift. Keep the existing stack and discuss framework/toolchain replacements or adding a backend/service with the user; supporting dependencies allowed by the README were not broadly prohibited.
- **Reported outcome:** the documentation chat completed a stack and responsibilities section in `docs/architecture.md`, based on package metadata and configuration, and linked directly to it from `AGENTS.md` for consultation before technical decisions. The executor noted npm as the documented workflow and two coexisting lockfiles, without inferring how dependencies were actually installed.
- **Scope:** documentation only; no tests or builds were run and no functional code was changed.

## 2026-10-19, 16:56 — Structure clarification and user pause

- **Request and reported completion:** the user requested an explicit structure/responsibility map and more descriptive progressive disclosure. The documentation executor confirmed completing revisions to `docs/architecture.md`, `docs/code-patterns.md`, and `AGENTS.md`, including the map, flow, and guidance on what each document contains and when to consult it.
- **Clarifications:** `src/` is the browser React frontend, with the HTTP client in `src/api.ts` and contracts in `src/types.ts`. `server/` provides simulated APIs through Node/Vite and fixtures, without an independent backend. The current configuration does not serve these endpoints in build/preview, and the form is not yet integrated.
- **Verification reported by the executor:** reviewed sources, final files, links, anchors, and path privacy; no tests or builds were run and no functionality was modified.
- **Pause and resumption:** the user requested a pause. The documentation task is complete; functional development has not been started by us, form integration remains pending, and no visual direction has been chosen. Resume from this recorded state.

## 2026-10-19, 17:53 — Resuming after the pause

- **Resumption:** the user returned, and the voice coordinator resumed explaining the challenge requirements and structure while recapping where work had stopped.
- **Last confirmed state, without new functional verification:** preparation was complete: local Git (no commits or remotes at the last known check), journal, path-privacy rules, four reference documents, and progressive disclosure. Functional development had not been started by us.
- **Structure recap:** `src/` is the React frontend running in the browser; `server/` hosts the simulated API within the Vite development server, without an independent backend. No new implementation decision was made during this recap.

## 2026-10-19, 17:57 — Local commit tooling

- **Request and reported delivery:** the user prioritized tooling and requested a simple local `auto-commit` skill to understand staged changes and intent, propose commit titles and grouping, and execute the approved groups. Using `skill-creator`, the documentation chat created `.agents/skills/auto-commit/SKILL.md` (55 lines) and a reference in `AGENTS.md`.
- **Documented workflow:** approve the concrete plan, group cohesive changes by paths, preserve partial staging and unstaged/untracked work, respect hooks, and never push.
- **Reported verification and scope:** `quick_validate.py` passed and the executor performed a static review. The skill has not been executed; no staging or commits occurred in this task, and the global skill remains unchanged. This is tooling preparation, not dashboard implementation.
