import type { LinguiConfig } from '@lingui/conf';
import { getAvailableLocaleCodes, SOURCE_LOCALE_CODE } from './lib/i18n/config';

const config: LinguiConfig = {
  locales: getAvailableLocaleCodes(),
  sourceLocale: SOURCE_LOCALE_CODE,
  fallbackLocales: {
    default: SOURCE_LOCALE_CODE,
  },
  orderBy: 'messageId',
  catalogs: [
    {
      path: 'locales/{locale}',
      include: ['app/', 'components/', 'lib/', 'modules/', 'integrations/'],
    },
  ],
};

export default config;
