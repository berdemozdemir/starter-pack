import { and, desc, eq } from 'drizzle-orm';
import { procedure_protected } from '@/integrations/orpc/procedure';
import {
  nextCreatedAtCursor,
  olderThanCreatedAtCursor,
  pageRows,
} from '@/lib/db/created-at-cursor';
import { notDeleted } from '@/lib/db/not-deleted';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_items } from '../db-tables';
import { listMineSchema } from '../schemas/list-mine';
import type { ExampleItem } from '../types';

export const orpc_example_listMine = procedure_protected
  .input(listMineSchema)
  .handler(async ({ context: { db, auth }, input }) => {
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
          and(
            eq(table_items.ownerId, auth.userId),
            notDeleted(table_items),
            olderThanCreatedAtCursor({
              createdAt: table_items.createdAt,
              id: table_items.id,
              cursor: input.cursor,
            }),
          ),
        )
        .orderBy(desc(table_items.createdAt), desc(table_items.id))
        .limit(input.limit + 1),
    );

    if (dbErr)
      return err({
        reason: 'database-error',
        message: 'Could not load items',
      });

    const nextCursor = nextCreatedAtCursor({
      items: rows,
      limit: input.limit,
    });
    const page = pageRows({ rows, limit: input.limit });

    const items: ExampleItem[] = page.map((row) => ({
      id: row.id,
      title: row.title,
      notes: row.notes ?? undefined,
      createdAt: row.createdAt,
    }));

    return ok({ items, nextCursor });
  })
  .callable();
