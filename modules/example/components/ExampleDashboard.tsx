'use client';

import { useMutation } from '@tanstack/react-query';
import { Trans, useLingui } from '@lingui/react/macro';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Heading1 } from '@/components/ui/typography/Heading';
import { Paragraph1, Paragraph2 } from '@/components/ui/typography/Paragraph';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/lib/paths';
import { useAuthQuery } from '@/modules/auth/client-queries';
import { UserRoles } from '@/modules/auth/types/user-role';
import {
  useExampleItemsInfiniteQuery,
  service_example,
} from '../client-queries';
import { CreateItemForm } from './CreateItemForm';
import { EmptyState } from './EmptyState';
import { InfiniteScrollSentinel } from '@/components/ui/InfiniteScrollSentinel';

export function ExampleDashboard() {
  const { t } = useLingui();
  const authQuery = useAuthQuery();
  const itemsQuery = useExampleItemsInfiniteQuery();
  const deleteMutation = useMutation(service_example.mutations.delete());

  const removeItem = async (id: string) => {
    await deleteMutation.mutateAsync({ id });
    toast.success(t`Item deleted`);
  };

  if (itemsQuery.data) {
    const items = itemsQuery.data.pages.flatMap((page) => page.items);
    const hasItems = items.length > 0;
    const isAdmin =
      authQuery.data?.isLoggedIn &&
      authQuery.data.user.role === UserRoles.Admin;

    return (
      <div className="flex flex-col gap-8">
        <header className="space-y-2">
          <Paragraph2 className="text-muted-foreground font-medium tracking-wide uppercase">
            <Trans>Starter pack · example module</Trans>
          </Paragraph2>
          <Heading1 className="font-semibold tracking-tight">
            <Trans>My items</Trans>
          </Heading1>
          <Paragraph2 className="text-muted-foreground">
            <Trans>
              This page shows the <code>modules/example</code> pattern:
              protected oRPC, TanStack Query, owner-scoped CRUD.
            </Trans>
          </Paragraph2>
          {isAdmin && (
            <Paragraph2>
              <Link
                href={paths.admin.base}
                className="font-medium underline-offset-4 hover:underline"
              >
                <Trans>View all items (admin)</Trans>
              </Link>
            </Paragraph2>
          )}
        </header>

        <CreateItemForm />

        {!hasItems && <EmptyState />}

        {hasItems && (
          <>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-border/60 bg-card flex items-start justify-between gap-4 rounded-xl border p-4"
                >
                  <div className="min-w-0">
                    <Paragraph1 className="truncate font-medium">
                      {item.title}
                    </Paragraph1>
                    {item.notes && (
                      <Paragraph2 className="text-muted-foreground mt-1">
                        {item.notes}
                      </Paragraph2>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => void removeItem(item.id)}
                  >
                    <Trans>Delete</Trans>
                  </Button>
                </li>
              ))}
            </ul>
            <InfiniteScrollSentinel
              hasNextPage={itemsQuery.hasNextPage}
              isFetchingNextPage={itemsQuery.isFetchingNextPage}
              fetchNextPage={itemsQuery.fetchNextPage}
            />
          </>
        )}
      </div>
    );
  }

  if (itemsQuery.isError)
    return (
      <Paragraph1 className="text-destructive">
        <Trans>
          Could not load items. Make sure you are signed in and migrations have
          been applied.
        </Trans>
      </Paragraph1>
    );

  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
