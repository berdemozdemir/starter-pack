# Next.js App Starter Pack

> This repository is a **starter pack**, not a finished product.
> It ships auth, oRPC, Drizzle, Supabase, TanStack Query, and domain-module conventions.
> `modules/example` is a teachable CRUD demo — delete it after your first real domain.

**Stack:** Next.js 16 · React 19 · Supabase (Auth + Storage) · Drizzle ORM · oRPC · TanStack Query · Zod · Tailwind 4 · shadcn/ui

---

## README vs AGENTS.md — which file do I need?

**Take both.** They serve different readers:

| File                      | Audience                                     | Purpose                                                                                       |
| ------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **README.md** (this file) | Humans cloning the repo                      | What this is, how to run locally, how to turn the clone into _your_ product, bootstrap prompt |
| **AGENTS.md**             | AI coding agents (+ humans writing features) | Architecture conventions, naming, checklists, what _not_ to do                                |
| **`.cursor/rules/`**      | Cursor (auto-loaded)                         | Same conventions, enforced while editing code                                                 |

Flow:

1. Read **README** → clone, install, env, first run, personalize
2. Keep **AGENTS.md** open (or let the agent load it) while building features
3. Don’t merge them into one file — humans skim README; agents follow AGENTS

Language for this shareable starter: **English** (docs, comments, and default UI copy). Change UI language when you bootstrap a product if needed.

---

## What you get

1. Clone this repo
2. Fill placeholders (name, URL, brand)
3. Delete or replace `modules/example`
4. Start shipping features

Demo UI lives in `modules/example/components/Page.tsx`.
Wire it from a thin App Router file only when you want a URL, e.g.:

```tsx
// app/dashboard/page.tsx
import { Page } from '@/modules/example/components/Page';

export default function DashboardPage() {
  return <Page />;
}
```

---

## Layout map

```text
app/                    # Thin routes only
modules/<domain>/       # Feature slice
  actions/              # orpc_* handlers
  client-queries.ts     # service_* TanStack Query layer
  components/           # UI (+ Page shell)
  schemas/              # Zod *Schema
  db-tables.ts          # Drizzle tables (when needed)
integrations/           # orpc, drizzle, supabase, tanstack-query
lib/                    # result, paths, utils
proxy.ts                # Next.js request edge (session refresh + auth redirects)
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

`pnpm supabase:start` requires `supabase/templates/recovery.html` because `supabase/config.toml` points at a custom password-reset email. That file ships with this starter — do not delete it unless you also remove the `[auth.email.template.recovery]` block from `config.toml`.

Storage is **optional**. This starter does not create buckets. When you need uploads, add bucket names, RLS under `integrations/supabase/policies/`, and extend `scripts/supabase/setup-local-storage.ts`.

| Service          | URL                    |
| ---------------- | ---------------------- |
| App              | http://localhost:3000  |
| Supabase Studio  | http://127.0.0.1:54323 |
| Email (Inbucket) | http://127.0.0.1:54324 |

---

## Turn this clone into your product

| #   | Change                     | Where                                                        |
| --- | -------------------------- | ------------------------------------------------------------ |
| 1   | Package name               | `package.json` → `name`                                      |
| 2   | Site name                  | `lib/constants/site.ts`, `app/layout.tsx` metadata           |
| 3   | App URL                    | `.env.local` → `NEXT_PUBLIC_APP_URL`                         |
| 4   | Supabase project           | `.env.local` URL + keys                                      |
| 5   | Brand / colors / fonts     | `app/globals.css`, `app/layout.tsx`                          |
| 5b  | Auth email template        | `supabase/config.toml` recovery `subject` + `supabase/templates/recovery.html` branding |
| 6   | Routes                     | `lib/paths.ts`                                               |
| 7   | Storage buckets (optional) | setup script + `integrations/supabase/policies/` when needed |
| 8   | CI environments            | `.github/workflows/*` + GitHub Environments                  |
| 9   | Example module             | Delete or morph into your first domain                       |
| 10  | Docs                       | Keep README for humans; update AGENTS domain table           |

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
- `default_locale` — `tr` or `en` (UI copy language)
- `app_url_local` — usually `http://localhost:3000`
- `primary_domain` — optional, e.g. `acme.app` (skip if none)
- `first_domain_module` — first real domain name (e.g. `projects`, `notes`)
  - `keep_example` — if `true`, keep `modules/example`; if `false`, delete it and scaffold empty `modules/<first_domain_module>/`
    (db-tables + list/create actions + client-queries + page component + router/schema register)
- `storage_buckets` — comma-separated bucket names, or `none`
- `github_sandbox_branch` — default `develop`
- `github_prod_branch` — default `main`

## Hard rules

- Do not break architecture: oRPC, Result pattern, `service_*`, thin `app/**/page.tsx`, named exports
- Update `AGENTS.md` + `.cursor/rules/` for the new product name; keep conventions
- JSX: `condition && <Node />` — never `condition ? <Node /> : null`
- Module UI lives under `modules/*/components/`; App Router files only wire those components
- `package.json` name = `project_slug`
- Site constants + root layout metadata = `site_name` / `site_description`
- Update Supabase recovery email branding: `supabase/config.toml` `[auth.email.template.recovery].subject` and copy in `supabase/templates/recovery.html` (keep the file — `supabase start` needs it)
- Trim `lib/paths.ts` to auth + dashboard + home unless I ask for more
- Align user-facing strings with `default_locale` (starter default is English)
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
6. Schema change → `pnpm drizzle:generate` → commit → `pnpm drizzle:migrate`
7. `pnpm typecheck && pnpm lint`

Details: **AGENTS.md** and **`.cursor/rules/`**.

---

## Commands

| Command                      | Purpose                     |
| ---------------------------- | --------------------------- |
| `pnpm dev`                   | Dev server                  |
| `pnpm typecheck`             | TypeScript                  |
| `pnpm lint`                  | ESLint                      |
| `pnpm format`                | Prettier                    |
| `pnpm drizzle:generate`      | Schema → SQL                |
| `pnpm drizzle:migrate`       | Migrate (prompts on remote) |
| `pnpm drizzle:migrate:force` | CI / local reset            |
| `pnpm db:reset-local`        | Reset local DB + storage    |
| `pnpm supabase:start`        | Local Supabase              |

---

## Sharing tips

- Mark the GitHub repo as a **Template**
- Never commit `.env.local` or production secrets
- Keep `modules/example` so newcomers learn by reading it
- Ship README + AGENTS.md + `.cursor/rules` together
# guneyagizvedis
