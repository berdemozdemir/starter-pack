import 'server-only';

import { type I18n, type Messages, setupI18n } from '@lingui/core';
import { allMessages } from './get-messages';
import {
  DEFAULT_LOCALE_CODE,
  getAvailableLocaleCodes,
  type LocaleCode,
} from '@/lib/i18n/config';

const allI18nInstances: Record<LocaleCode, I18n> =
  getAvailableLocaleCodes().reduce(
    (acc, locale) => {
      const messages: Messages = allMessages[locale];
      acc[locale] = setupI18n({
        locale,
        messages: { [locale]: messages },
      });
      return acc;
    },
    {} as Record<LocaleCode, I18n>,
  );

export function getI18nInstance(locale: LocaleCode) {
  return allI18nInstances[locale] ?? allI18nInstances[DEFAULT_LOCALE_CODE];
}
