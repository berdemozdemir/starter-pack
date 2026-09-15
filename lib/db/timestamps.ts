import { timestamp } from 'drizzle-orm/pg-core';

/** `updated_at` is also maintained by `public.set_updated_at` (BEFORE UPDATE trigger).
 *  New tables that spread `...timestamps` need the same trigger attached in a migration. */
export const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),

  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};
