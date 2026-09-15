import { procedure_admin } from '@/integrations/orpc/procedure';
import { notDeleted } from '@/lib/db/not-deleted';
import { err, ok, tryCatchDb } from '@/lib/result';
import { and, desc, eq } from 'drizzle-orm';
import { table_users } from '@/modules/auth/db-tables';
import { table_items } from '../db-tables';
import type { ExampleAdminItem } from '../types';

export const orpc_example_listAll = procedure_admin.handler(
  async ({ context: { db } }) => {
    const [dbErr, rows] = await tryCatchDb(() =>
      db
        .select({
          id: table_items.id,
          title: table_items.title,
          notes: table_items.notes,
          createdAt: table_items.createdAt,
          ownerName: table_users.name,
          ownerEmail: table_users.email,
        })
        .from(table_items)
        .innerJoin(table_users, eq(table_items.ownerId, table_users.id))
        .where(and(notDeleted(table_items), notDeleted(table_users)))
        .orderBy(desc(table_items.createdAt)),
    );

    if (dbErr)
      return err({
        reason: 'database-error',
        message: 'Could not load items',
      });

    const items: ExampleAdminItem[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      notes: row.notes ?? undefined,
      createdAt: row.createdAt,
      ownerName: row.ownerName,
      ownerEmail: row.ownerEmail,
    }));

    return ok({ items });
  },
);
