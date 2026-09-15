'use client';

import { I18nProvider } from '@lingui/react';
import { i18n as globalI18n, setupI18n, type Messages } from '@lingui/core';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { isSupportedLocaleCode } from '@/lib/i18n/config';

function localeFromRoute(args: {
  pathname: string;
  languageParam: string | Array<string> | undefined;
}) {
  if (
    typeof args.languageParam === 'string' &&
    isSupportedLocaleCode(args.languageParam)
  )
    return args.languageParam;

  const segment = args.pathname.split('/')[1];
  if (segment && isSupportedLocaleCode(segment)) return segment;

  return undefined;
}

export const LinguiClientProvider = (props: {
  children: ReactNode;
  initialLocale: string;
  allMessages: Record<string, Messages>;
}) => {
  const params = useParams();
  const pathname = usePathname();
  const pathLocale = localeFromRoute({
    pathname,
    languageParam: params.language,
  });
  const locale = pathLocale ?? props.initialLocale;

  const [i18n] = useState(() => {
    globalI18n.loadAndActivate({
      locale: props.initialLocale,
      messages: props.allMessages[props.initialLocale] ?? {},
    });

    return setupI18n({
      locale: props.initialLocale,
      messages: props.allMessages,
    });
  });

  useEffect(() => {
    const messages = props.allMessages[locale];
    if (!messages) return;

    i18n.loadAndActivate({ locale, messages });
    document.documentElement.lang = locale;
  }, [i18n, locale, props.allMessages]);

  return <I18nProvider i18n={i18n}>{props.children}</I18nProvider>;
};
