import { z } from 'zod';

export const deleteItemSchema = z.object({
  id: z.uuid('Invalid id'),
});

export type DeleteItemSchemaRequest = z.infer<typeof deleteItemSchema>;
