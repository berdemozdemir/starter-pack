# Contributing

## Getting started

1. Create a branch (see naming below)
2. Write code following project conventions (see `AGENTS.md` and `.cursor/rules/`)
3. Open a PR targeting `develop`
4. Ensure CI passes (`tests-ci`, `verify-migrations-integrity`)
5. Squash-merge after review

## Commit messages

Write commit messages as imperative commands:

```txt
<scope>: <message>
```

Examples:

```txt
feat: add example item notes field
fix: login redirect missing dashboard path
refactor: extract supabase auth message helper
```

Common scopes: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`.

## Branch naming

```txt
feature/<short-description>
fix/<short-description>
```

Examples: `feature/example-list-filters`, `fix/auth-callback-redirect`.

## Pull requests

- Target branch: `develop` (for features/fixes), `main` (only for release merges)
- Title: same format as commit messages
- Include screenshots for UI changes
- Describe what changed and why

## Code guidelines

Full conventions live in `.cursor/rules/`. Key points:

- oRPC handlers in `modules/*/actions/`, TanStack Query via `service_*` objects
- User-facing strings in English by default
- Minimal diffs — no drive-by refactors
- Schema changes: `pnpm drizzle:generate` → commit migration files → test with `pnpm drizzle:migrate`

## Environments

| Branch    | Deploys to |
| --------- | ---------- |
| `develop` | Sandbox    |
| `main`    | Production |

See `README.md` for local setup and `AGENTS.md` for agent-oriented project reference.
