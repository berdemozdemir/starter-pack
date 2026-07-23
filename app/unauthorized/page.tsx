import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants/site';
import { paths } from '@/lib/paths';

export const metadata: Metadata = {
  title: `Unauthorized | ${SITE_NAME}`,
  description:
    'Sign in or use an account with the right permissions to view this page.',
};

export default function UnauthorizedPage() {
  return (
    <main className="bg-background text-foreground mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
        {SITE_NAME}
      </p>
      <p className="text-6xl font-semibold tracking-tight">401</p>
      <h1 className="text-2xl font-semibold tracking-tight">Unauthorized</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Sign in or use an account with the right permissions to view this page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={paths.auth.login}
          className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium"
        >
          Log in
        </Link>
        <Link
          href={paths.home}
          className="border-border inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
