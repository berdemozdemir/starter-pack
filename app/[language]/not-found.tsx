import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants/site';
import { paths } from '@/lib/paths';

export const metadata: Metadata = {
  title: `Page not found | ${SITE_NAME}`,
  description: 'The page you requested could not be found.',
};

export default function NotFound() {
  return (
    <main className="bg-background text-foreground mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
        {SITE_NAME}
      </p>
      <p className="text-6xl font-semibold tracking-tight">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        The address may be wrong, or the page may have moved.
      </p>
      <Link
        href={paths.home}
        className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium"
      >
        Back to home
      </Link>
    </main>
  );
}
