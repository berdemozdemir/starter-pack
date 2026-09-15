import 'server-only';

import { getI18nInstance } from '@/integrations/lingui/get-i18n-instance';
import { getRequestLocale } from '@/lib/i18n/get-request-locale';

export const getI18nInstanceFromRequest = async () =>
  getI18nInstance(await getRequestLocale());
