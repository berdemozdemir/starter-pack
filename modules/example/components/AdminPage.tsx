'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/lib/paths';
import { useExampleAdminItemsQuery } from '../client-queries';

export function AdminPage() {
  return (
    <PageLayout>
      <AdminItems />
    </PageLayout>
  );
}

function AdminItems() {
  const itemsQuery = useExampleAdminItemsQuery();

  if (itemsQuery.data) {
    const hasItems = itemsQuery.data.items.length > 0;

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Admin · all items
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">All items</h1>
          <p className="text-muted-foreground text-sm">
            This route is gated by <code>requireAdmin()</code> in{' '}
            <code>app/[language]/admin/layout.tsx</code> and loaded with{' '}
            <code>procedure_admin</code>. Members are redirected away.
          </p>
          <p>
            <Link
              href={paths.dashboard.base}
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Back to my items
            </Link>
          </p>
        </header>

        {!hasItems && (
          <p className="text-muted-foreground text-sm">No items yet.</p>
        )}

        {hasItems && (
          <ul className="space-y-3">
            {itemsQuery.data.items.map((item) => (
              <li
                key={item.id}
                className="border-border/60 bg-card rounded-xl border p-4"
              >
                <p className="truncate font-medium">{item.title}</p>
                {item.notes && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {item.notes}
                  </p>
                )}
                <p className="text-muted-foreground mt-2 text-xs">
                  {item.ownerName} · {item.ownerEmail}
                </p>
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
        <p className="text-destructive text-sm">Could not load items.</p>
      </div>
    );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
