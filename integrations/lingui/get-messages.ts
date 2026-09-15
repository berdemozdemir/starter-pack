import type { Messages } from '@lingui/core';
import linguiConfig from '@/lingui.config';
import { DEFAULT_LOCALE_CODE, type LocaleCode } from '@/lib/i18n/config';

const { locales } = linguiConfig;

async function loadCatalog(locale: LocaleCode) {
  const { messages } = await import(`@/locales/${locale}.js`);
  return { [locale]: messages as Messages };
}

const catalogs = await Promise.all(
  locales.map((locale) => loadCatalog(locale as LocaleCode)),
);

export const allMessages = catalogs.reduce(
  (acc, catalog) => Object.assign(acc, catalog),
  {},
) as Record<LocaleCode, Messages>;

export function getMessages(locale: LocaleCode) {
  return allMessages[locale] ?? allMessages[DEFAULT_LOCALE_CODE];
}
