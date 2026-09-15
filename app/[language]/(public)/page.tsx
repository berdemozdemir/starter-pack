import { msg } from '@lingui/core/macro';
import { getI18nInstanceFromRequest } from '@/lib/i18n-lingui/actions/get-i18n-instance-from-request';
import { Page } from '@/modules/landing/components/Page';

export async function generateMetadata() {
  const i18n = await getI18nInstanceFromRequest();

  return {
    description: i18n._(
      msg`Auth, oRPC, Drizzle, Supabase, and TanStack Query conventions — plus a delete-able modules/example CRUD demo.`,
    ),
  };
}

export default function HomePage() {
  return <Page />;
}
