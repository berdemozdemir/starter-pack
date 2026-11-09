import type { Metadata } from 'next';
import Link from 'next/link';
import { Heading1, Heading2 } from '@/components/ui/typography/Heading';
import { Paragraph2 } from '@/components/ui/typography/Paragraph';
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
      <Paragraph2 className="text-muted-foreground tracking-[0.2em] uppercase">
        {SITE_NAME}
      </Paragraph2>
      <Heading1 className="font-semibold tracking-tight">Unauthorized</Heading1>
      <Heading2 className="font-semibold tabular-nums">401</Heading2>
      <Paragraph2 className="text-muted-foreground leading-relaxed">
        Sign in or use an account with the right permissions to view this page.
      </Paragraph2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={paths.auth.login}
          className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium"
        >
          Log in
        </Link>
        <Link
          href={paths.home}
          className="border-border inline-flex items-center justify-center rounded-lg border px-4 py-2 font-medium"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
