import type { NextRequest } from 'next/server';
import type {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/compiled/@edge-runtime/cookies';
import {
  DEFAULT_LOCALE_CODE,
  isSupportedLocaleCode,
  LOCALE_COOKIE_KEY,
  type LocaleCode,
} from './config';

export const getUserLocaleFromCookie = (
  cookies: RequestCookies | ResponseCookies,
) => cookies.get(LOCALE_COOKIE_KEY)?.value as LocaleCode | undefined;

export const getUserLocaleFromRequest = (req: NextRequest): LocaleCode => {
  const userCookieLocale = getUserLocaleFromCookie(req.cookies);

  if (userCookieLocale && isSupportedLocaleCode(userCookieLocale))
    return userCookieLocale;

  const userHeaderLocale = req.headers
    .get('accept-language')
    ?.split(',')[0]
    ?.split('-')[0]
    ?.trim();

  if (userHeaderLocale && isSupportedLocaleCode(userHeaderLocale))
    return userHeaderLocale;

  return DEFAULT_LOCALE_CODE;
};
