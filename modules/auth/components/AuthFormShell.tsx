'use client';

import { SiteMark } from '@/components/branding/SiteMark';
import { Heading1 } from '@/components/ui/typography/Heading';
import { Paragraph1 } from '@/components/ui/typography/Paragraph';
import { SITE_NAME } from '@/lib/constants/site';
import { paths } from '@/lib/paths';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthFormShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export const AuthFormShell = ({
  title,
  subtitle,
  children,
}: AuthFormShellProps) => {
  return (
    <div className="relative w-full max-w-88">
      <div
        aria-hidden
        className="from-primary/25 to-accent/20 pointer-events-none absolute -inset-px rounded-[1.35rem] bg-linear-to-br via-transparent blur-xl"
      />

      <div className="from-card/95 to-background relative overflow-hidden rounded-2xl border border-foreground/10 bg-linear-to-b shadow-xl">
        <div
          aria-hidden
          className="bg-primary/[0.07] pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full"
        />
        <div
          aria-hidden
          className="bg-accent/10 pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full"
        />

        <div className="relative px-8 pt-10 pb-8">
          <div className="relative mx-auto mb-7 flex w-fit flex-col items-center">
            <Sparkles
              aria-hidden
              className="text-primary/45 absolute top-1 -left-7 size-5"
              strokeWidth={1.25}
            />
            <Sparkles
              aria-hidden
              className="text-primary/45 absolute top-1 -right-7 size-5 scale-x-[-1]"
              strokeWidth={1.25}
            />

            <Link
              href={paths.home}
              className="focus-visible:ring-primary/55 flex flex-col items-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="from-primary/30 via-primary/10 ring-primary/35 ring-offset-card flex h-17 w-17 items-center justify-center rounded-full bg-linear-to-br to-transparent ring-2 ring-offset-2">
                <SiteMark className="h-10 w-10" />
              </div>

              <Paragraph1 className="text-primary mt-4 text-center font-semibold tracking-tight">
                {SITE_NAME}
              </Paragraph1>
            </Link>

            <Heading1 className="mt-3 text-center font-semibold tracking-tight">
              {title}
            </Heading1>
            <Paragraph1 className="text-foreground/65 mt-2 max-w-68 text-center leading-relaxed">
              {subtitle}
            </Paragraph1>

            <div aria-hidden className="border-border mt-6 w-24 border-t" />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
