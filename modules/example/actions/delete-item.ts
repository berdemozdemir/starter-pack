import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { and, eq } from 'drizzle-orm';
import { table_items } from '../db-tables';
import { deleteItemSchema } from '../schemas/delete-item';

export const orpc_example_deleteItem = procedure_protected
  .input(deleteItemSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    const [deleteErr, deleted] = await tryCatchDb(() =>
      db
        .delete(table_items)
        .where(
          and(
            eq(table_items.id, input.id),
            eq(table_items.ownerId, auth.userId),
          ),
        )
        .returning({ id: table_items.id }),
    );

    if (deleteErr)
      return err({
        reason: 'delete-failed',
        message: 'Could not delete item',
      });

    if (!deleted[0])
      return err({
        reason: 'not-found',
        message: 'Item not found',
      });

    return ok({ id: deleted[0].id });
  });
