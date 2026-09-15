# App Starter — Agent Guide

This repository is a **starter pack**, not a finished product.
Use it as the foundation for a new Next.js app with the conventions below.

**Stack:** Next.js 16 · Supabase · Drizzle ORM · oRPC · TanStack Query · Lingui · Tailwind/shadcn · Zod

Coding conventions live in `.cursor/rules/` (auto-loaded by Cursor) and are summarized here.

> Humans: start with **README.md** (setup + bootstrap).
> Agents: follow this file + `.cursor/rules/` while writing code.

## What this starter includes

- Auth module (login, signup, session, password reset)
- Request edge in `proxy.ts` (Supabase session refresh + guest/protected redirects)
- oRPC API layer (`/api/rpc`) with `procedure_public` / `procedure_protected` / `procedure_admin`
- Drizzle + Postgres (local Supabase) + migration scripts
- TanStack Query via `service_*` objects and `usePublicQuery` / `useSessionQuery` / `useSessionInfiniteQuery`
- Lingui i18n on every page (`app/[language]/`, catalogs in `locales/`)
- Theme switcher (`next-themes`, light / dark / system) next to the language switcher
- Demo domain: `modules/example` (owner-scoped items CRUD) — delete after your first real domain

## Project layout

```
app/                    # Next.js routes (thin pages only)
app/[language]/         # Locale-prefixed app (`/en/...`, `/tr/...`)
app/api/                # Unprefixed API
modules/<domain>/       # Feature modules
  actions/              # oRPC handlers (orpc_* exports)
  client-queries.ts     # service_* TanStack Query layer
  components/           # UI components (+ *Page shells)
  schemas/              # Zod *Schema files
  db-tables.ts          # Drizzle pgTable definitions
integrations/           # orpc, supabase, drizzle, tanstack-query wiring
lib/                    # Shared utilities (result, paths, db helpers)
proxy.ts                # Request edge: session refresh + auth redirects + locale prefix
locales/                # Lingui catalogs (`en.po`, `tr.po`; compiled `.js` is gitignored)
database/migrations/    # Drizzle SQL migrations (auto-generated)
```

## Key patterns

### oRPC actions (`modules/*/actions/`)

- Export `orpc_doSomething` from kebab-case files (`do-something.ts`)
- Handler logic **inline** inside `.handler()` — no separate handler functions
- Use `tryCatch` / `tryCatchDb` + `ok` / `err` from `@/lib/result` — never throw (except in DB transactions)
- Server-side calls: chain `.callable()` and invoke directly — no HTTP client
- Auth: `procedure_public` (none) / `procedure_protected` (signed in) / `procedure_admin` (`admin` role)

### Client queries (`modules/*/client-queries.ts`)

- Single `service_<domain>` object with `queries` and `mutations`
- `queryOptions()` / `mutationOptions()` / `infiniteQueryOptions()` + `okOrThrow`
- Components use `usePublicQuery` or `useSessionQuery` — not raw `useQuery`. Unbounded lists use `useSessionInfiniteQuery` with a `createdAt` + `id` cursor (`@/lib/db/created-at-cursor`) — not raw `useInfiniteQuery`
- Prefer invalidating via `onSuccess` + `queryClient.invalidateQueries` (or `meta.invalidates`)
- Component hook order: local state / forms → queries → mutations → handlers
- Do not destructure query `.data` into locals — use `query.data.field` in JSX
- Render: `.data` first, then `.isError`, then loading — not `isSuccess`

### Pages

- `app/**/page.tsx` = minimal wiring only
- Logic and UI live in `modules/*/components/` (e.g. `Page`, `ExampleDashboard`)
- Module page component is always named `Page` — the module path already scopes it
- Protected UI: gate in the route **layout** — `requireAuth()` on `app/[language]/dashboard/layout.tsx`, `requireAdmin()` on `app/[language]/admin/layout.tsx`. `proxy.ts` is the first redirect; oRPC `procedure_*` is the API gate. `PageLayout` is chrome, not auth.

```tsx
// app/[language]/dashboard/layout.tsx — requireAuth()
// app/[language]/admin/layout.tsx — requireAdmin()
// app/**/page.tsx — thin; module Page = content + PageLayout
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

### Forms

- Submit button bottom-right (`flex justify-end`)
- Disable submit when unchanged: `disabled={!form.formState.isDirty || mutation.isPending}`
- After success, `form.reset(...)` so dirty state clears

### Database

- Table vars: `table_*`, enums: `pgEnum_*`, timestamps: `...timestamps` from `@/lib/db/timestamps` (`createdAt`, `updatedAt`, `deletedAt`)
- `updated_at` is set by DB trigger `trg_set_updated_at` → `public.set_updated_at()` on UPDATE. New tables with `...timestamps` must attach the same trigger in their migration
- Soft delete: `notDeleted(table)` / `softDeleteNow()` from `@/lib/db/not-deleted`. Reads/updates always filter `notDeleted`; content deletes are `update().set(softDeleteNow())` — never `.delete()` except composite-PK junction tables
- Unique slugs: partial unique index `WHERE deleted_at IS NULL` — do not use `.unique()` on the slug column
- Schema changes: edit `db-tables.ts` → register in `integrations/drizzle/drizzle-schema.ts` → `pnpm drizzle:generate` → append `trg_set_updated_at` if the table uses `...timestamps` → commit SQL → `pnpm drizzle:migrate`
- App tables: every `pgTable` uses `.enableRLS()` (lockdown for PostgREST/`anon`); auth stays in oRPC. Do **not** add table `CREATE POLICY` unless querying via Supabase client roles. `DATABASE_URL` bypasses RLS so the app is unaffected
- Supabase Storage is **optional**: add RLS under `integrations/supabase/policies/` only when you introduce buckets

### UI language / i18n

- **Whole app:** Lingui macros (`Trans`, `t`, `msg`). `LinguiClientProvider` is inside `components/providers` (root layout passes locale + messages)
- English source strings in code; Turkish in `locales/tr.po`. Default URL locale `en`
- Every page lives under `app/[language]/` (`/en/dashboard`, `/tr/auth/login`). Only `app/api` (and static files) stay unprefixed
- Links and redirects use unprefixed `paths.*` (`/auth/login`, `/dashboard`). `proxy.ts` adds the locale prefix
- After changing copy: `pnpm i18n:extract` → fill `locales/tr.po` → `pnpm i18n:compile`
- Language switcher: `@/lib/i18n/components/LanguageSwitcher` in `app/[language]/layout.tsx`
- Theme switcher: `@/components/ThemeSwitcher` next to the language switcher (`next-themes`, light / dark / system)
- How-tos (i18n steps, infinite query, auth layers): **README.md** — this file only states the rules

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
| `pnpm i18n:extract`                       | Extract public strings into `locales/*.po`               |
| `pnpm i18n:compile`                       | Compile catalogs to `locales/*.js` (gitignored)          |

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

CI on PRs: `tests-ci` (typecheck + lint), `verify-migrations-integrity`, `i18n` (catalogs up to date).

## New feature checklist

1. Create or extend a domain under `modules/`
2. Add oRPC handler in `actions/` + register in `integrations/orpc/router.ts`
3. Add `service_*` queries/mutations in `client-queries.ts`
4. Build UI in `components/`, keep `app/**/page.tsx` thin
5. Add Zod schemas with `*Schema` suffix in `schemas/`
6. If DB changes: update `db-tables.ts` (every `pgTable` ends with `.enableRLS()`), register in `drizzle-schema.ts`, generate + migrate
7. Public strings: English source + Lingui macros; then `pnpm i18n:extract` and fill `locales/tr.po`
8. Run `pnpm typecheck` and `pnpm lint`

## Domains in this starter

| Module    | Purpose                                                                           |
| --------- | --------------------------------------------------------------------------------- |
| `auth`    | Login, signup, password reset, session, roles (`member` / `admin`)                |
| `landing` | Public home under `app/[language]/(public)/`                                      |
| `example` | Teachable owner-scoped CRUD + admin list-all — **delete after first real domain** |

Add your product domains to this table as you build them.

## What not to do

- No `"use server"` — use oRPC
- No default exports (except Next.js pages/layouts and config files)
- No `console.log` debug dumps
- No barrel `index.ts` re-exports
- No new i18n library — use Lingui as wired (`lib/i18n`, `locales/*.po`)
- No destructuring `args` in long functions — use `args.field` directly
- No `handle*` on your own functions (library APIs like `form.handleSubmit` are fine)
- No `condition ? <Node /> : null` — use `condition && <Node />`
- No destructuring query `.data` into locals — use `query.data.field`
- No `.delete()` on content tables — use `softDeleteNow()`
- No app-table `CREATE POLICY` unless you query via Supabase `anon`/`authenticated`
