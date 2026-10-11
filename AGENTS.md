# AGENTS.md — Idea Development

## Purpose
This repository is a personal sandbox for independent ideas, prototypes and works in progress. It is **not** a monorepo application, unified product, or shared framework. Each top-level project directory represents its own separate project.

## Scope and project isolation
- **Work only inside the project folder relevant to the request.** Do not modify another project's files as a side effect.
- A request mentioning one project does **not** authorise changes to other projects, even when they use similar technology or code.
- Treat each project as having its own architecture, dependencies, package manager, configuration, environment variables, commands, release process and design choices.
- Do **not** add root-level workspaces, shared components, common dependencies, global build scripts, cross-project imports, or centralised configuration unless expressly requested.
- Never assume an approach used in one project should be copied into others.
- Do not rename, relocate, merge, extract or delete projects without an explicit request.
- Root-level files should remain minimal and repository-focused. Do not make root changes for ordinary project-specific tasks.

## Before making changes
1. Identify the intended project folder from the user's request; if unclear, inspect the folders and choose only when the target is evident.
2. Read that project's README, package/config files, and any **nested AGENTS.md** before editing.
3. Inspect the project's existing patterns and conventions rather than imposing a repo-wide preference.
4. Keep changes focused on the stated task; avoid unrelated cleanup or broad rewrites.

## Implementation and verification
- Run development, test, lint and build commands **from the targeted project's folder**, using its own documented tooling.
- Preserve existing functionality unless changes are requested. Validate only the affected project where practical.
- Keep credentials, local environment files, node_modules, build artefacts and other generated output out of commits.
- Make small, descriptive commits that show the progression of meaningful changes.
- Explain which project was changed, what was verified, and any remaining limitations.

## Documentation and agent memory
- The root README explains the repository's purpose; it is not a catalogue of implementation instructions.
- Use the relevant project's README and nested AGENTS.md as the source of truth for that project.
- Record enduring project-specific architectural decisions and agent guidance inside that project's folder, not in this root file.
- Update this root AGENTS.md only when the repository-wide rule of **independent project boundaries** itself needs changing.

## Guiding rule
**One request, one project by default.** Keep experiments separate and do not turn this repository into a global app or shared codebase.
