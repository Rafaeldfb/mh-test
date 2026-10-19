# Agent instructions

## Read only what the task needs

Start with [README.md](README.md), the source of challenge requirements and deliverables. Then consult:

- [Architecture](docs/architecture.md) for stack, file structure, execution boundaries, and data flow; read before technical decisions or locating responsibilities.
- [Code patterns](docs/code-patterns.md) for implementation conventions; read when writing or refactoring code.
- [Quality gates](docs/quality-gates.md) for size, complexity, correctness, and readability guidelines; read when writing or reviewing code.
- [Design](docs/design.md) for existing styles and unresolved presentation choices; read when changing the UI.
- [Testing](docs/testing.md) for commands, coverage, and verification limits; read when testing or validating changes.
- [Local auto-commit skill](.agents/skills/auto-commit/SKILL.md) for planning and committing staged changes; read when the user requests staged commits.

These references describe the inspected starter, not an approved future implementation. Update relevant references when behavior changes; keep them short and avoid duplicating requirements.

## Paths in repository content

Do not expose personal directory structures in journals, documentation, or other shareable artifacts. Use project-relative paths or, when a root is needed, the illustrative `/mh-test` root. Do not include personal absolute paths, ancestor directory prefixes, or usernames in repository content. Real local paths may be used internally to run tools, but must not be copied into artifacts.

## Code comments

Keep code comments brief and focused on information that is not obvious from the code. Update comments together with code so they remain accurate. Prefer relative references where helpful.
