import { z } from 'zod';

export const Locales = {
  tr: { code: 'tr', nativeName: 'Türkçe', flag: '🇹🇷', locale: 'tr-TR' },
  en: { code: 'en', nativeName: 'English', flag: '🇬🇧', locale: 'en-GB' },
} as const;

export type LocaleCode = keyof typeof Locales;
export type Locale = (typeof Locales)[LocaleCode];

export function getAvailableLocales() {
  return Object.values(Locales).map(
    ({ code, nativeName, flag }) =>
      ({
        code,
        nativeName,
        flag,
      }) as const,
  );
}

export function getAvailableLocaleCodes(): [LocaleCode, ...LocaleCode[]] {
  return Object.keys(Locales) as [LocaleCode, ...LocaleCode[]];
}

export function isSupportedLocaleCode(code: string): code is LocaleCode {
  return code in Locales;
}

export function getPrettyLocale(value: LocaleCode) {
  return Locales[value].nativeName;
}

/** Full locale string for Intl APIs (e.g. 'tr-TR', 'en-GB') */
export function getIntlLocale(code: string) {
  return isSupportedLocaleCode(code)
    ? Locales[code].locale
    : Locales[DEFAULT_LOCALE_CODE].locale;
}

export const zodLocaleSchema = z.enum(getAvailableLocaleCodes(), {
  message: 'Locale is required',
});

/** Default for URL redirects / cookie when preference is unknown */
export const DEFAULT_LOCALE_CODE = 'en';

/** Source language of message IDs in code (Lingui catalogs) */
export const SOURCE_LOCALE_CODE = 'en';

export const DEFAULT_LOCALE: Locale = Locales[DEFAULT_LOCALE_CODE];
export const LOCALE_COOKIE_KEY = 'locale';
