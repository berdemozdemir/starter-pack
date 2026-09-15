'use client';

import Link from 'next/link';
import { Trans } from '@lingui/react/macro';
import { SITE_NAME } from '@/lib/constants/site';
import { paths } from '@/lib/paths';

export function Page() {
  return (
    <main className="bg-background text-foreground mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          <Trans>Next.js starter</Trans>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{SITE_NAME}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          <Trans>
            Auth, oRPC, Drizzle, Supabase, and TanStack Query conventions — plus
            a delete-able{' '}
            <code className="text-foreground">modules/example</code> CRUD demo.
          </Trans>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={paths.auth.login}
          className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium"
        >
          <Trans>Log in</Trans>
        </Link>
        <Link
          href={paths.auth.signup}
          className="border-border inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium"
        >
          <Trans>Sign up</Trans>
        </Link>
        <Link
          href={paths.dashboard.base}
          className="border-border text-muted-foreground inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium"
        >
          <Trans>Dashboard</Trans>
        </Link>
      </div>
    </main>
  );
}
