import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_items } from '../db-tables';
import { createItemSchema } from '../schemas/create-item';

export const orpc_example_createItem = procedure_protected
  .input(createItemSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    const notes = input.notes?.trim() || null;

    const [insertErr, inserted] = await tryCatchDb(() =>
      db
        .insert(table_items)
        .values({
          ownerId: auth.userId,
          title: input.title.trim(),
          notes,
        })
        .returning({ id: table_items.id }),
    );

    if (insertErr)
      return err({
        reason: 'create-failed',
        message: 'Could not create item',
      });

    if (!inserted[0])
      return err({
        reason: 'create-failed',
        message: 'Could not create item',
      });

    return ok({ id: inserted[0].id });
  });
