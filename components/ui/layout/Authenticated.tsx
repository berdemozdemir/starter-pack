'use client';

import { paths } from '@/lib/paths';
import { useAuthQuery } from '@/modules/auth/client-queries';
import { useRouter } from 'next/navigation';
import { useEffect, type PropsWithChildren } from 'react';
import { PageLayout, type PageLayoutProps } from './PageLayout';

export function Authenticated({ children }: PropsWithChildren) {
  const router = useRouter();

  const { data, isPending, isFetching } = useAuthQuery();

  // After login, auth query is invalidated; cached { isLoggedIn: false } from the marketing
  // header can still be present while a refetch runs. In that window isLoading is false but
  // the session is valid—wait until the refetch finishes before redirecting to login.
  const waitingOnAuth = isPending || (isFetching && !data?.isLoggedIn);

  useEffect(() => {
    if (waitingOnAuth) return;

    if (!data?.isLoggedIn) {
      router.push(paths.auth.login);
    }
  }, [data?.isLoggedIn, waitingOnAuth, router]);

  if (waitingOnAuth || !data?.isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

export function AuthenticatedPage(props: PageLayoutProps) {
  return (
    <Authenticated>
      <PageLayout {...props} />
    </Authenticated>
  );
}
