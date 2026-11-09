'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Heading1 } from '@/components/ui/typography/Heading';
import { Paragraph1, Paragraph2 } from '@/components/ui/typography/Paragraph';
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
      <div className="flex flex-col gap-8">
        <header className="space-y-2">
          <Paragraph2 className="text-muted-foreground font-medium tracking-wide uppercase">
            Admin · all items
          </Paragraph2>
          <Heading1 className="font-semibold tracking-tight">
            All items
          </Heading1>
          <Paragraph2 className="text-muted-foreground">
            This route is gated by <code>requireAdmin()</code> in{' '}
            <code>app/[language]/admin/layout.tsx</code> and loaded with{' '}
            <code>procedure_admin</code>. Members are redirected away.
          </Paragraph2>
          <Paragraph2>
            <Link
              href={paths.dashboard.base}
              className="font-medium underline-offset-4 hover:underline"
            >
              Back to my items
            </Link>
          </Paragraph2>
        </header>

        {!hasItems && (
          <Paragraph2 className="text-muted-foreground">
            No items yet.
          </Paragraph2>
        )}

        {hasItems && (
          <ul className="space-y-3">
            {itemsQuery.data.items.map((item) => (
              <li
                key={item.id}
                className="border-border/60 bg-card rounded-xl border p-4"
              >
                <Paragraph1 className="truncate font-medium">
                  {item.title}
                </Paragraph1>
                {item.notes && (
                  <Paragraph2 className="text-muted-foreground mt-1">
                    {item.notes}
                  </Paragraph2>
                )}
                <Paragraph2 className="text-muted-foreground mt-2">
                  {item.ownerName} · {item.ownerEmail}
                </Paragraph2>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (itemsQuery.isError)
    return (
      <Paragraph1 className="text-destructive">
        Could not load items.
      </Paragraph1>
    );

  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
