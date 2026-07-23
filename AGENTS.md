# App Starter — Agent Guide

This repository is a **starter pack**, not a finished product.
Use it as the foundation for a new Next.js app with the conventions below.

**Stack:** Next.js 16 · Supabase · Drizzle ORM · oRPC · TanStack Query · Tailwind/shadcn · Zod

Coding conventions live in `.cursor/rules/` (auto-loaded by Cursor) and are summarized here.

> Humans: start with **README.md** (setup + bootstrap).
> Agents: follow this file + `.cursor/rules/` while writing code.

## What this starter includes

- Auth module (login, signup, session, password reset)
- oRPC API layer (`/api/rpc`) with `procedure_public` / `procedure_protected`
- Drizzle + Postgres (local Supabase) + migration scripts
- TanStack Query via `service_*` objects and `usePublicQuery` / `useSessionQuery`
- Demo domain: `modules/example` (owner-scoped items CRUD) — delete after your first real domain

## Project layout

```
app/                    # Next.js routes (thin pages only)
modules/<domain>/       # Feature modules
  actions/              # oRPC handlers (orpc_* exports)
  client-queries.ts     # service_* TanStack Query layer
  components/           # UI components (+ *Page shells)
  schemas/              # Zod *Schema files
  db-tables.ts          # Drizzle pgTable definitions
integrations/           # orpc, supabase, drizzle, tanstack-query wiring
lib/                    # Shared utilities (result, paths, db helpers)
database/migrations/    # Drizzle SQL migrations (auto-generated)
```

## Key patterns

### oRPC actions (`modules/*/actions/`)

- Export `orpc_doSomething` from kebab-case files (`do-something.ts`)
- Handler logic **inline** inside `.handler()` — no separate handler functions
- Use `tryCatch` / `tryCatchDb` + `ok` / `err` from `@/lib/result` — never throw (except in DB transactions)
- Server-side calls: chain `.callable()` and invoke directly — no HTTP client
- Auth: `procedure_public` vs `procedure_protected`

### Client queries (`modules/*/client-queries.ts`)

- Single `service_<domain>` object with `queries` and `mutations`
- `queryOptions()` / `mutationOptions()` + `okOrThrow`
- Components use `usePublicQuery` or `useSessionQuery` — not raw `useQuery`
- Prefer invalidating via `onSuccess` + `queryClient.invalidateQueries` (or `meta.invalidates`)

### Pages

- `app/**/page.tsx` = minimal wiring only
- Logic and UI live in `modules/*/components/` (e.g. `Page`, `ExampleDashboard`)
- Module page component is always named `Page` — the module path already scopes it
- Protected UI: wrap with `<Authenticated />` or `<AuthenticatedPage />` inside the module `Page` when possible

```tsx
// modules/example/components/Page.tsx
export function Page() {
  return (
    <AuthenticatedPage>
      <ExampleDashboard />
    </AuthenticatedPage>
  );
}

// app/dashboard/page.tsx
import { Page } from '@/modules/example/components/Page';

export default function DashboardPage() {
  return <Page />;
}
```

### JSX conditionals

- Optional / branch UI: `condition && <Node />`
- Never `condition ? <Node /> : null`
- Prefer two `&&` branches (or early `return`) over a ternary that picks between two trees

```tsx
{
  item.notes && <p>{item.notes}</p>;
}
{
  !hasItems && <EmptyState />;
}
{
  hasItems && <ItemList items={items} />;
}
```

### Database

- Table vars: `table_*`, enums: `pgEnum_*`, timestamps: `...timestamps` from `@/lib/db/timestamps`
- Schema changes: edit `db-tables.ts` → register in `integrations/drizzle/drizzle-schema.ts` → `pnpm drizzle:generate` → commit SQL → `pnpm drizzle:migrate`
- App tables: auth via oRPC (no Postgres RLS required when querying with `DATABASE_URL`)
- Supabase Storage is **optional**: add RLS under `integrations/supabase/policies/` only when you introduce buckets

### UI language

- Default starter copy is **English** (UI, Zod messages, server `message` fields, docs)
- No i18n libraries unless explicitly requested

## Commands

| Command                                   | Purpose                                                  |
| ----------------------------------------- | -------------------------------------------------------- |
| `pnpm dev`                                | Local dev server                                         |
| `pnpm typecheck`                          | TypeScript check                                         |
| `pnpm lint`                               | ESLint                                                   |
| `pnpm drizzle:generate`                   | Generate migration from schema                           |
| `pnpm drizzle:migrate`                    | Run migrations (prompts on remote)                       |
| `pnpm drizzle:migrate:force`              | Run migrations without prompt (CI/reset)                 |
| `pnpm db:reset-local`                     | Full local reset: supabase reset + migrate + storage     |
| `pnpm supabase:start` / `stop` / `status` | Local Supabase                                           |
| `pnpm supabase:setup-storage`             | Optional local storage bootstrap (no buckets by default) |

## Environments (customize per product)

| Env        | Branch    | Notes                                            |
| ---------- | --------- | ------------------------------------------------ |
| Local      | —         | `pnpm dev` + Supabase Docker (`127.0.0.1:54322`) |
| Sandbox    | `develop` | Staging DB + deploy                              |
| Production | `main`    | Prod DB + deploy                                 |

Never use prod `DATABASE_URL` locally. Local secrets in `.env.local` (from `.env.example`).

## Branch workflow

```
feature/* → PR → develop  → sandbox migration + deploy
develop   → PR → main      → prod migration + deploy
```

CI on PRs: `tests-ci` (typecheck + lint), `verify-migrations-integrity`.

## New feature checklist

1. Create or extend a domain under `modules/`
2. Add oRPC handler in `actions/` + register in `integrations/orpc/router.ts`
3. Add `service_*` queries/mutations in `client-queries.ts`
4. Build UI in `components/`, keep `app/**/page.tsx` thin
5. Add Zod schemas with `*Schema` suffix in `schemas/`
6. If DB changes: update `db-tables.ts`, register in `drizzle-schema.ts`, generate + migrate
7. User-facing strings in English (or your product language after bootstrap)
8. Run `pnpm typecheck` and `pnpm lint`

## Domains in this starter

| Module    | Purpose                                                          |
| --------- | ---------------------------------------------------------------- |
| `auth`    | Login, signup, password reset, session                           |
| `example` | Teachable owner-scoped CRUD — **delete after first real domain** |

Add your product domains to this table as you build them.

## What not to do

- No `"use server"` — use oRPC
- No default exports (except Next.js pages/layouts and config files)
- No `console.log` debug dumps
- No barrel `index.ts` re-exports
- No i18n framework unless explicitly requested
- No destructuring `args` in long functions — use `args.field` directly
- No `handle*` on your own functions (library APIs like `form.handleSubmit` are fine)
- No `condition ? <Node /> : null` — use `condition && <Node />`
