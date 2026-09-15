import { msg } from '@lingui/core/macro';
import { getI18nInstanceFromRequest } from '@/lib/i18n-lingui/actions/get-i18n-instance-from-request';
import { Page } from '@/modules/landing/components/Page';

export async function generateMetadata() {
  const i18n = await getI18nInstanceFromRequest();

  return {
    description: i18n._(
      msg`A clone-and-ship Next.js foundation with auth, locale-prefixed routes, oRPC, Drizzle, and TanStack Query conventions.`,
    ),
  };
}

export default function HomePage() {
  return <Page />;
}
