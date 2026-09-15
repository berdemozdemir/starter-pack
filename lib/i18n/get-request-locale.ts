import 'server-only';

import { cookies } from 'next/headers';
import {
  DEFAULT_LOCALE_CODE,
  isSupportedLocaleCode,
  LOCALE_COOKIE_KEY,
} from './config';

export async function getRequestLocale() {
  const localeCode = (await cookies()).get(LOCALE_COOKIE_KEY)?.value;

  if (localeCode && isSupportedLocaleCode(localeCode)) return localeCode;

  return DEFAULT_LOCALE_CODE;
}
