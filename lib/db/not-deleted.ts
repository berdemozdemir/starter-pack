import { isNull } from 'drizzle-orm';
import type { AnyColumn } from 'drizzle-orm';

export function notDeleted(table: { deletedAt: AnyColumn }) {
  return isNull(table.deletedAt);
}

export function softDeleteNow() {
  const now = new Date();
  return { deletedAt: now, updatedAt: now };
}
