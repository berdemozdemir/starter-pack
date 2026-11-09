import type { Metadata } from 'next';
import Link from 'next/link';
import { Heading1, Heading2 } from '@/components/ui/typography/Heading';
import { Paragraph2 } from '@/components/ui/typography/Paragraph';
import { SITE_NAME } from '@/lib/constants/site';
import { paths } from '@/lib/paths';

export const metadata: Metadata = {
  title: `Page not found | ${SITE_NAME}`,
  description: 'The page you requested could not be found.',
};

export default function NotFound() {
  return (
    <main className="bg-background text-foreground mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <Paragraph2 className="text-muted-foreground tracking-[0.2em] uppercase">
        {SITE_NAME}
      </Paragraph2>
      <Heading1 className="font-semibold tracking-tight">
        Page not found
      </Heading1>
      <Heading2 className="font-semibold tabular-nums">404</Heading2>
      <Paragraph2 className="text-muted-foreground leading-relaxed">
        The address may be wrong, or the page may have moved.
      </Paragraph2>
      <Link
        href={paths.home}
        className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium"
      >
        Back to home
      </Link>
    </main>
  );
}
