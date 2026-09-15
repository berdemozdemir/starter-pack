import { z } from 'zod';
import { LIST_PAGE_SIZE } from '@/lib/constants/list-page-size';
import { createdAtCursorSchema } from '@/lib/db/created-at-cursor';

export const listMineSchema = z.object({
  cursor: createdAtCursorSchema.optional(),
  limit: z.number().int().min(1).max(50).default(LIST_PAGE_SIZE),
});
