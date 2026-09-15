import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';
import { table_users } from '@/modules/auth/db-tables';

/**
 * Starter-pack demo table.
 * Shows the colocated Drizzle schema pattern: one domain owns its tables.
 * Delete this module when you build your real domain.
 */
export const table_items = pgTable('items', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  ownerId: uuid('owner_id')
    .references(() => table_users.id, { onDelete: 'cascade' })
    .notNull(),

  title: text('title').notNull(),
  notes: text('notes'),

  ...timestamps,
}).enableRLS();
