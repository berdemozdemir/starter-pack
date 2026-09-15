'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from '@/components/ui/Button';
import { SITE_NAME } from '@/lib/constants/site';
import { paths } from '@/lib/paths';

const STACK = [
  'Next.js 16',
  'Supabase',
  'Drizzle',
  'oRPC',
  'TanStack Query',
  'Lingui',
  'Zod',
  'Tailwind',
] as const;

export function Page() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
      <section className="max-w-2xl space-y-6">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          <Trans>Starter pack, not a product</Trans>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{SITE_NAME}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          <Trans>
            A clone-and-ship Next.js foundation: auth, locale-prefixed routes,
            oRPC, Drizzle, and TanStack Query conventions. Read README.md to run
            it; keep AGENTS.md open while an agent writes features.
          </Trans>
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={paths.auth.login}>
              <Trans>Log in</Trans>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={paths.auth.signup}>
              <Trans>Sign up</Trans>
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href={paths.dashboard.base}>
              <Trans>Dashboard</Trans>
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide uppercase">
          <Trans>Stack</Trans>
        </h2>
        <ul className="flex flex-wrap gap-2">
          {STACK.map((item) => (
            <li
              key={item}
              className="border-border bg-muted/40 text-foreground rounded-full border px-3 py-1 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          <Trans>What ships</Trans>
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            title={<Trans>Auth</Trans>}
            body={
              <Trans>
                Login, signup, password reset, member/admin roles. Layouts call
                requireAuth / requireAdmin; oRPC procedures gate the API.
              </Trans>
            }
          />
          <FeatureCard
            title={<Trans>Locale-prefixed app</Trans>}
            body={
              <Trans>
                Pages live under /en and /tr. Links use unprefixed paths;
                proxy.ts adds the locale. Language and theme switchers sit in
                the header.
              </Trans>
            }
          />
          <FeatureCard
            title={<Trans>oRPC + Result</Trans>}
            body={
              <Trans>
                Typed procedures instead of Next.js server actions. Handlers
                return ok / err — they do not throw.
              </Trans>
            }
          />
          <FeatureCard
            title={<Trans>Drizzle + Postgres</Trans>}
            body={
              <Trans>
                Local Supabase, timestamps, soft delete, RLS lockdown on app
                tables. Auth stays in oRPC, not table policies.
              </Trans>
            }
          />
          <FeatureCard
            title={<Trans>TanStack Query</Trans>}
            body={
              <Trans>
                service_* objects with usePublicQuery / useSessionQuery.
                Unbounded lists use useSessionInfiniteQuery and a createdAt + id
                cursor — see the example dashboard.
              </Trans>
            }
          />
          <FeatureCard
            title={<Trans>Lingui</Trans>}
            body={
              <Trans>
                English source strings in code, Turkish in locales/tr.po. After
                copy changes: extract, translate, compile.
              </Trans>
            }
          />
        </ul>
      </section>

      <section className="border-border bg-muted/30 space-y-3 rounded-2xl border p-6">
        <h2 className="text-xl font-semibold tracking-tight">
          <Trans>Where conventions live</Trans>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <Trans>
            Humans clone from README.md (setup, how-tos, bootstrap prompt).
            Agents follow AGENTS.md and .cursor/rules/ while writing code. Do
            not merge those files — keep them consistent.
          </Trans>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          <Trans>Delete the demo domain</Trans>
        </h2>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          <Trans>
            <code>modules/example</code> is owner-scoped CRUD plus an admin
            list-all. It exists so you can read a complete slice (actions,
            infinite query, UI). Replace it with your first real domain.
          </Trans>
        </p>
      </section>
    </main>
  );
}

function FeatureCard(props: { title: ReactNode; body: ReactNode }) {
  return (
    <li className="border-border bg-card rounded-2xl border p-5">
      <h3 className="font-medium tracking-tight">{props.title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {props.body}
      </p>
    </li>
  );
}
