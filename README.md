# Next.js App Starter Pack

> This repository is a **starter pack**, not a finished product.
> Clone it, rename it, delete `modules/example`, and ship your domain on top of the conventions below.

**Stack:** Next.js 16 · React 19 · Supabase (Auth + Storage) · Drizzle ORM · oRPC · TanStack Query · Lingui · Zod · Tailwind 4 · shadcn/ui · next-themes

---

## README vs AGENTS.md — which file do I need?

**Take both.** They serve different readers:

| File                      | Audience                                     | Purpose                                                                                            |
| ------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **README.md** (this file) | Humans cloning the repo                      | What this is, how to run locally, how each system works, how to turn the clone into _your_ product |
| **AGENTS.md**             | AI coding agents (+ humans writing features) | Architecture conventions, naming, checklists, what _not_ to do                                     |
| **`.cursor/rules/`**      | Cursor (auto-loaded)                         | Same conventions, enforced while editing code                                                      |

1. Read **README** → clone, install, env, first run, personalize
2. Keep **AGENTS.md** open (or let the agent load it) while building features
3. Don’t merge them into one file — humans skim README; agents follow AGENTS

UI copy in this shareable starter is **English in source** (Lingui message IDs). Every page is locale-prefixed (`/en/...`, `/tr/...`). Language and theme switchers live in `app/[language]/layout.tsx`.

---

## What you get

1. Clone this repo
2. Fill placeholders (name, URL, brand)
3. Delete or replace `modules/example`
4. Start shipping features

The public homepage explains the pack in the browser. The teachable CRUD demo is `modules/example` — wired from a thin App Router file:

```tsx
// app/[language]/dashboard/page.tsx
import { Page } from '@/modules/example/components/Page';

export default function DashboardPage() {
  return <Page />;
}
```

---

## Layout map

```text
app/                    # Thin routes only
app/[language]/         # Locale-prefixed app pages
app/api/                # Unprefixed API (`/api/rpc`)
modules/<domain>/       # Feature slice
  actions/              # orpc_* handlers
  client-queries.ts     # service_* TanStack Query layer
  components/           # UI (+ Page shell)
  schemas/              # Zod *Schema
  db-tables.ts          # Drizzle tables (when needed)
integrations/           # orpc, drizzle, supabase, tanstack-query, lingui
lib/                    # result, paths, i18n, db helpers
proxy.ts                # Request edge (session, auth, locale prefix)
locales/                # Lingui catalogs (commit `.po`; compiled `.js` is gitignored)
database/migrations/    # Drizzle-generated SQL
scripts/                # migrate + local storage setup
.cursor/rules/          # Coding conventions for agents
```

---

## Local quickstart

**Requirements:** Node 22+, pnpm 10+, Docker Desktop, Supabase CLI

```bash
pnpm install
cp .env.example .env.local
pnpm supabase:start
pnpm drizzle:migrate
pnpm supabase:setup-storage   # optional — no buckets ship by default
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Guests hitting `/` are redirected to `/en` (or `/tr` if the `locale` cookie / `Accept-Language` prefers Turkish). Login is `/en/auth/login`.

`pnpm supabase:start` requires `supabase/templates/recovery.html` because `supabase/config.toml` points at a custom password-reset email. That file ships with this starter — do not delete it unless you also remove the `[auth.email.template.recovery]` block from `config.toml`.

Storage is **optional**. This starter does not create buckets. When you need uploads, add bucket names, RLS under `integrations/supabase/policies/`, and extend `scripts/supabase/setup-local-storage.ts`.

| Service          | URL                    |
| ---------------- | ---------------------- |
| App              | http://localhost:3000  |
| Supabase Studio  | http://127.0.0.1:54323 |
| Email (Inbucket) | http://127.0.0.1:54324 |

Signup creates a `member`. To try `/admin` (gated by `requireAdmin()` + `procedure_admin`):

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Then sign in again. Members hitting `/en/admin` are sent back to `/en/dashboard`.

---

## How this starter works

Each section is: what it is, where it lives, what you do. Naming laws stay in **AGENTS.md**.

### Auth

Login, signup, session, password reset, roles (`member` / `admin`).

| Layer                                          | Job                                                                                    |
| ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| `proxy.ts`                                     | First redirect: guests off `/dashboard` and `/admin`; signed-in users off login/signup |
| `app/[language]/dashboard/layout.tsx`          | `requireAuth()` — any signed-in user                                                   |
| `app/[language]/admin/layout.tsx`              | `requireAdmin()`                                                                       |
| oRPC `procedure_protected` / `procedure_admin` | API gate                                                                               |

`PageLayout` is width/padding, not an auth gate. Promote yourself with the SQL above, then sign in again.

### Locale-prefixed app (Lingui)

Every page lives under `app/[language]/` (`/en/dashboard`, `/tr/auth/login`). Only `app/api` (and static files) stay unprefixed.

- Links and redirects use unprefixed `paths.*` (`href={paths.auth.login}` → `/auth/login`).
- `proxy.ts` adds `/en` or `/tr` and sets the `locale` cookie.
- `LinguiClientProvider` is inside `components/providers` so `Trans` / `t` / `msg` work on every route.
- English stays in the source. Turkish translations live in `locales/tr.po`. Default URL locale is `en` (`lib/i18n/config.ts`).

**When you add or change user-visible copy:**

1. Wrap the string with `Trans`, `t`, or `msg` (English in code).
2. `pnpm i18n:extract` — updates `locales/en.po` and `locales/tr.po`.
3. Fill empty `msgstr` rows in `locales/tr.po`.
4. `pnpm i18n:compile` — writes gitignored `locales/*.js`.

CI job `i18n` fails if catalogs are stale or Turkish strings are missing. `pnpm build` compiles catalogs before `next build`.

Language switcher: `@/lib/i18n/components/LanguageSwitcher`. Theme switcher (light / dark / system, `next-themes`): `@/components/ThemeSwitcher`. Both are in `app/[language]/layout.tsx`.

oRPC `message` fields stay user-friendly English — server Result payloads are not Lingui catalogs.

### oRPC + Result

No `"use server"`. Handlers live in `modules/*/actions/`, export `orpc_*`, and register in `integrations/orpc/router.ts`.

- `procedure_public` — no auth
- `procedure_protected` — signed in
- `procedure_admin` — `admin` role

Handlers return `ok` / `err` from `@/lib/result` and use `tryCatch` / `tryCatchDb`. They do not throw (except inside DB transactions). Client code unwraps with `okOrThrow`. Server-to-server calls use `.callable()`, not the HTTP client.

### TanStack Query

Each domain has one `service_<domain>` in `client-queries.ts` (`queries` + `mutations`). Components use:

- `usePublicQuery` — no session required
- `useSessionQuery` — runs only when signed in
- `useSessionInfiniteQuery` — signed-in unbounded lists

Do not call raw `useQuery` / `useInfiniteQuery` from components.

**Infinite lists:** page by `createdAt` + `id` (not offset). Helpers are in `@/lib/db/created-at-cursor`. The example dashboard is the working sample (`modules/example`):

```ts
// client-queries.ts
list: () =>
  infiniteQueryOptions({
    queryFn: ({ pageParam }) =>
      orpc.example.listMine
        .call({ cursor: pageParam, limit: LIST_PAGE_SIZE })
        .then(okOrThrow),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }),
```

```tsx
const itemsQuery = useSessionInfiniteQuery(service_example.queries.list());

if (itemsQuery.data) {
  const items = itemsQuery.data.pages.flatMap((page) => page.items);
  return <List items={items} />;
}
```

Invalidate after mutations with `queryClient.invalidateQueries` (see `service_example.mutations`).

### Drizzle + Postgres

Tables live next to the domain (`modules/*/db-tables.ts`) and register in `integrations/drizzle/drizzle-schema.ts`.

- Spread `...timestamps` (`createdAt`, `updatedAt`, `deletedAt`). New tables must attach trigger `trg_set_updated_at` in their migration.
- Soft-delete content rows with `notDeleted` / `softDeleteNow` from `@/lib/db/not-deleted`. Do not `.delete()` content tables.
- Every `pgTable` ends with `.enableRLS()`. Do **not** add table `CREATE POLICY` unless you query via Supabase `anon` / `authenticated`. App queries use `DATABASE_URL` and bypass RLS. That lockdown is so PostgREST cannot read app tables.

Schema change: edit `db-tables.ts` → register → `pnpm drizzle:generate` → append the updated_at trigger if needed → `pnpm drizzle:migrate`.

### Pages

`app/**/page.tsx` only wires a module component. The module export is always named `Page`. Logic, queries, and UI stay in `modules/*/components/`.

### Storage (optional)

No buckets ship by default. Add RLS under `integrations/supabase/policies/` when you introduce a bucket.

---

## Turn this clone into your product

| #   | Change                     | Where                                                                                   |
| --- | -------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Package name               | `package.json` → `name`                                                                 |
| 2   | Site name                  | `lib/constants/site.ts`, `app/layout.tsx` metadata                                      |
| 3   | App URL                    | `.env.local` → `NEXT_PUBLIC_APP_URL`                                                    |
| 4   | Supabase project           | `.env.local` URL + keys                                                                 |
| 5   | Brand / colors / fonts     | `app/globals.css`, `app/layout.tsx`                                                     |
| 5b  | Auth email template        | `supabase/config.toml` recovery `subject` + `supabase/templates/recovery.html` branding |
| 6   | Routes                     | `lib/paths.ts`                                                                          |
| 7   | Storage buckets (optional) | setup script + `integrations/supabase/policies/` when needed                            |
| 8   | CI environments            | `.github/workflows/*` + GitHub Environments                                             |
| 9   | Example module             | Delete or morph into your first domain                                                  |
| 10  | Docs                       | Keep README for humans; update AGENTS domain table                                      |
| 11  | Default locale             | `lib/i18n/config.ts` → `DEFAULT_LOCALE_CODE` (`en` in this starter)                     |

### Minimum Drizzle aggregator (starter)

```ts
import * as userSchema from '@/modules/auth/db-tables';
import * as exampleSchema from '@/modules/example/db-tables';

export const drizzleSchema = {
  ...userSchema,
  ...exampleSchema,
};
```

New domain: add `db-tables.ts` → import here → `pnpm drizzle:generate` → migrate.

---

## Bootstrap prompt (give this to your AI agent)

After cloning, paste the prompt below. The agent must **ask for parameters first** and must **not edit files** until you answer.

```markdown
You are working in this Next.js **starter pack** folder (not a finished product).

## Your job

1. Ask me for the parameters below (one message). Do not change any files until I answer.
2. After I answer, personalize the starter into my new app identity.
3. Finish with a short “what changed / what’s next” summary.

## Parameters to collect

- `project_slug` — npm package name (kebab-case), e.g. `acme-dashboard`
- `site_name` — product name shown to users, e.g. `Acme Dashboard`
- `site_description` — one-sentence metadata description
- `default_locale` — `en` or `tr` (default URL locale in `lib/i18n/config.ts`)
- `app_url_local` — usually `http://localhost:3000`
- `primary_domain` — optional, e.g. `acme.app` (skip if none)
- `first_domain_module` — first real domain name (e.g. `projects`, `notes`)
  - `keep_example` — if `true`, keep `modules/example`; if `false`, delete it and scaffold empty `modules/<first_domain_module>/`
    (db-tables + list/create actions + client-queries + page component + router/schema register).
    Unbounded lists must use `useSessionInfiniteQuery` + `createdAt`/`id` cursor helpers, not raw `useInfiniteQuery`.
- `storage_buckets` — comma-separated bucket names, or `none`
- `github_sandbox_branch` — default `develop`
- `github_prod_branch` — default `main`

## Hard rules

- Follow `AGENTS.md` and `.cursor/rules/`. Do not invent a second architecture.
- Do not break: oRPC, Result pattern, `service_*`, thin `app/**/page.tsx`, named exports
- Update `AGENTS.md` + `.cursor/rules/` for the new product name; keep conventions
- JSX: `condition && <Node />` — never `condition ? <Node /> : null`
- Module UI lives under `modules/*/components/`; App Router files only wire those components
- Links and redirects stay unprefixed `paths.*`; `proxy.ts` adds `/en` or `/tr`
- `package.json` name = `project_slug`
- Site constants + root layout metadata = `site_name` / `site_description`
- Update Supabase recovery email branding: `supabase/config.toml` `[auth.email.template.recovery].subject` and copy in `supabase/templates/recovery.html` (keep the file — `supabase start` needs it)
- Trim `lib/paths.ts` to auth + dashboard + home unless I ask for more
- Public copy: English in source (`Trans` / `t` / `msg`), Turkish in `locales/tr.po`. Set `DEFAULT_LOCALE_CODE` from `default_locale`. After copy edits: `pnpm i18n:extract` → fill `tr.po` → `pnpm i18n:compile`
- Document only what exists in this repo
- Do not invent secrets; leave `.env.example` placeholders
- Do not create a git commit unless I ask
- End with checklist: `pnpm install` → env → supabase → migrate → `pnpm dev`

## Output format

1. Numbered parameter questions
2. After approval: file changes
3. “First 3 feature steps”
```

### Example answers

```text
project_slug: nota-app
site_name: Nota
site_description: Keep your notes private and searchable.
default_locale: en
app_url_local: http://localhost:3000
primary_domain: (none)
first_domain_module: notes
keep_example: false
storage_buckets: none
github_sandbox_branch: develop
github_prod_branch: main
```

---

## Adding a feature

1. Create/extend `modules/<domain>/`
2. Register oRPC handlers in `integrations/orpc/router.ts`
3. Register tables in `integrations/drizzle/drizzle-schema.ts` when needed
4. Add `service_<domain>` in `client-queries.ts`
5. Keep `app/**/page.tsx` thin; put UI in module components
6. Schema change → `pnpm drizzle:generate` → commit SQL → `pnpm drizzle:migrate`
7. Public copy change → `pnpm i18n:extract` → fill `locales/tr.po` → `pnpm i18n:compile`
8. `pnpm typecheck && pnpm lint`

Details: **AGENTS.md** and **`.cursor/rules/`**.

---

## Commands

| Command                      | Purpose                      |
| ---------------------------- | ---------------------------- |
| `pnpm dev`                   | Dev server                   |
| `pnpm typecheck`             | TypeScript                   |
| `pnpm lint`                  | ESLint                       |
| `pnpm format`                | Prettier                     |
| `pnpm drizzle:generate`      | Schema → SQL                 |
| `pnpm drizzle:migrate`       | Migrate (prompts on remote)  |
| `pnpm drizzle:migrate:force` | CI / local reset             |
| `pnpm db:reset-local`        | Reset local DB + storage     |
| `pnpm supabase:start`        | Local Supabase               |
| `pnpm supabase:stop`         | Stop local Supabase          |
| `pnpm i18n:extract`          | Extract public strings       |
| `pnpm i18n:compile`          | Compile Lingui catalogs      |
| `pnpm i18n:check`            | Extract + compile `--strict` |

---

## Sharing tips

- Mark the GitHub repo as a **Template**
- Never commit `.env.local` or production secrets
- Keep `modules/example` so newcomers learn by reading it
- Ship README + AGENTS.md + `.cursor/rules` together
