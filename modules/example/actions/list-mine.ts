import { procedure_protected } from '@/integrations/orpc/procedure';
import { notDeleted } from '@/lib/db/not-deleted';
import { err, ok, tryCatchDb } from '@/lib/result';
import { and, desc, eq } from 'drizzle-orm';
import { table_items } from '../db-tables';
import type { ExampleItem } from '../types';

export const orpc_example_listMine = procedure_protected
  .handler(async ({ context: { db, auth } }) => {
    const [dbErr, rows] = await tryCatchDb(() =>
      db
        .select({
          id: table_items.id,
          title: table_items.title,
          notes: table_items.notes,
          createdAt: table_items.createdAt,
        })
        .from(table_items)
        .where(
          and(eq(table_items.ownerId, auth.userId), notDeleted(table_items)),
        )
        .orderBy(desc(table_items.createdAt)),
    );

    if (dbErr)
      return err({
        reason: 'database-error',
        message: 'Could not load items',
      });

    const items: ExampleItem[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      notes: row.notes ?? undefined,
      createdAt: row.createdAt,
    }));

    return ok({ items });
  })
  .callable();
