import { z } from 'zod';

export const createItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(120, 'Title must be at most 120 characters'),
  notes: z.string().max(2000).optional(),
});

export type CreateItemSchemaRequest = z.infer<typeof createItemSchema>;
