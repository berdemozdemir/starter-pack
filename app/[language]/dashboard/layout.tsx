import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { requireAuth } from '@/modules/auth/utils/require-role';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout(props: PropsWithChildren) {
  await requireAuth();

  return <main className="px-8 py-8">{props.children}</main>;
}
