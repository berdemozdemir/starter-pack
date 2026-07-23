import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';

export const table_users = pgTable('users', {
  /** The same id as in the auth table */
  id: uuid('id').primaryKey().notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),

  ...timestamps,
});
