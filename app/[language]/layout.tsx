import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import {
  getAvailableLocaleCodes,
  isSupportedLocaleCode,
} from '@/lib/i18n/config';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/lib/i18n/components/LanguageSwitcher';

export function generateStaticParams() {
  return getAvailableLocaleCodes().map((language) => ({ language }));
}

export default async function LocaleLayout(props: {
  children: ReactNode;
  params: Promise<{ language: string }>;
}) {
  const { language } = await props.params;

  if (!isSupportedLocaleCode(language)) notFound();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex justify-end px-6 py-4">
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex flex-1 flex-col">{props.children}</div>
    </div>
  );
}
