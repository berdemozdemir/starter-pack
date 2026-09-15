import { and, eq, lt, or, type Column, type SQL } from 'drizzle-orm';
import { z } from 'zod';

export const createdAtCursorSchema = z.object({
  createdAt: z.coerce.date(),
  id: z.uuid(),
});

export type CreatedAtCursor = z.infer<typeof createdAtCursorSchema>;

export function olderThanCreatedAtCursor(args: {
  createdAt: Column;
  id: Column;
  cursor: CreatedAtCursor | undefined;
}): SQL | undefined {
  if (!args.cursor) return undefined;

  return or(
    lt(args.createdAt, args.cursor.createdAt),
    and(eq(args.createdAt, args.cursor.createdAt), lt(args.id, args.cursor.id)),
  );
}

export function nextCreatedAtCursor(args: {
  items: Array<{ createdAt: Date; id: string }>;
  limit: number;
}): CreatedAtCursor | undefined {
  if (args.items.length <= args.limit) return undefined;

  const last = args.items[args.limit - 1];
  if (!last) return undefined;

  return { createdAt: last.createdAt, id: last.id };
}

export function pageRows<T>(args: { rows: T[]; limit: number }) {
  if (args.rows.length <= args.limit) return args.rows;
  return args.rows.slice(0, args.limit);
}
