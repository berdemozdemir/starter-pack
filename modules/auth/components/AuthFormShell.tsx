'use client';

import { SiteMark } from '@/components/branding/SiteMark';
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
    <div className="animate-fade-in-up relative w-full max-w-88">
      <div
        aria-hidden
        className="from-gold/25 to-rose/20 pointer-events-none absolute -inset-px rounded-[1.35rem] bg-linear-to-br via-transparent blur-xl"
      />

      <div className="from-deep-light/95 to-deep relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b shadow-[0_24px_48px_-12px_rgba(0,0,0,0.55)]">
        <div
          aria-hidden
          className="bg-gold/[0.07] pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full"
        />
        <div
          aria-hidden
          className="bg-rose/10 pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full"
        />

        <div className="relative px-8 pt-10 pb-8">
          <div className="relative mx-auto mb-7 flex w-fit flex-col items-center">
            <Sparkles
              aria-hidden
              className="text-gold/45 absolute top-1 -left-7 size-5"
              strokeWidth={1.25}
            />
            <Sparkles
              aria-hidden
              className="text-gold/45 absolute top-1 -right-7 size-5 scale-x-[-1]"
              strokeWidth={1.25}
            />

            <Link
              href={paths.home}
              className="focus-visible:ring-gold/55 flex flex-col items-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="from-gold/30 via-gold/10 ring-gold/35 ring-offset-deep-light flex h-17 w-17 items-center justify-center rounded-full bg-linear-to-br to-transparent ring-2 ring-offset-2">
                <SiteMark className="h-10 w-10" />
              </div>

              <span className="font-display text-gold mt-4 text-center text-base font-semibold tracking-tight">
                {SITE_NAME}
              </span>
            </Link>

            <h1 className="font-display text-cream mt-3 text-center text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-cream/65 mt-2 max-w-68 text-center text-sm leading-relaxed">
              {subtitle}
            </p>

            <div aria-hidden className="section-divider mt-6 w-24 opacity-80" />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
