import { i18n } from '@lingui/core';
import { SOURCE_LOCALE_CODE } from '@/lib/i18n/config';

export function register() {
  if (!i18n.locale)
    i18n.loadAndActivate({ locale: SOURCE_LOCALE_CODE, messages: {} });
}
