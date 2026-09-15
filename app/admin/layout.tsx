import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { requireAdmin } from '@/modules/auth/utils/require-role';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout(props: PropsWithChildren) {
  await requireAdmin();
  return props.children;
}
