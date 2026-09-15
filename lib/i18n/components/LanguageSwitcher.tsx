'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useLingui } from '@lingui/react/macro';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  DEFAULT_LOCALE_CODE,
  getAvailableLocales,
  isSupportedLocaleCode,
  type LocaleCode,
} from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  variant?: 'default' | 'onPrimary';
};

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const variant = props.variant ?? 'default';
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLingui();

  const currentLocale =
    typeof params.language === 'string' &&
    isSupportedLocaleCode(params.language)
      ? params.language
      : DEFAULT_LOCALE_CODE;

  const locales = getAvailableLocales();
  const currentLocaleData = locales.find((l) => l.code === currentLocale);

  const switchLocale = (newLocale: LocaleCode) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={t`Change language`}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-medium transition-colors',
            variant === 'onPrimary'
              ? 'text-primary-foreground h-8 gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] opacity-90 hover:bg-white/10 hover:opacity-100 md:h-auto md:px-2.5'
              : 'border-border bg-background text-foreground hover:bg-muted h-9 border px-3 py-2',
          )}
        >
          <span aria-hidden>{currentLocaleData?.flag}</span>
          {variant === 'onPrimary' && (
            <span className="uppercase">{currentLocale}</span>
          )}

          {variant === 'default' && (
            <>
              <span className="hidden sm:inline">
                {currentLocaleData?.nativeName}
              </span>
              <span className="uppercase sm:hidden">{currentLocale}</span>
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => switchLocale(locale.code)}
            className={cn(
              'cursor-pointer',
              currentLocale === locale.code && 'bg-accent',
            )}
          >
            <span className="mr-2" aria-hidden>
              {locale.flag}
            </span>
            <span>{locale.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
