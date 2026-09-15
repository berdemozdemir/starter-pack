'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/lib/paths';
import { useAuthQuery } from '@/modules/auth/client-queries';
import { UserRoles } from '@/modules/auth/types/user-role';
import { useExampleItemsQuery, service_example } from '../client-queries';
import { CreateItemForm } from './CreateItemForm';
import { EmptyState } from './EmptyState';

export function ExampleDashboard() {
  const authQuery = useAuthQuery();
  const itemsQuery = useExampleItemsQuery();
  const deleteMutation = useMutation(service_example.mutations.delete());

  const removeItem = async (id: string) => {
    await deleteMutation.mutateAsync({ id });
    toast.success('Item deleted');
  };

  if (itemsQuery.data) {
    const hasItems = itemsQuery.data.items.length > 0;
    const isAdmin =
      authQuery.data?.isLoggedIn &&
      authQuery.data.user.role === UserRoles.Admin;

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Starter pack · example module
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">My items</h1>
          <p className="text-muted-foreground text-sm">
            This page shows the <code>modules/example</code> pattern: protected
            oRPC, TanStack Query, owner-scoped CRUD.
          </p>
          {isAdmin && (
            <p>
              <Link
                href={paths.admin.base}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                View all items (admin)
              </Link>
            </p>
          )}
        </header>

        <CreateItemForm />

        {!hasItems && <EmptyState />}

        {hasItems && (
          <ul className="space-y-3">
            {itemsQuery.data.items.map((item) => (
              <li
                key={item.id}
                className="border-border/60 bg-card flex items-start justify-between gap-4 rounded-xl border p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  {item.notes && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.notes}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => void removeItem(item.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (itemsQuery.isError)
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-destructive text-sm">
          Could not load items. Make sure you are signed in and migrations have
          been applied.
        </p>
      </div>
    );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
