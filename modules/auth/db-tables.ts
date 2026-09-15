import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';
import { UserRoles } from './types/user-role';

export const pgEnum_user_role = pgEnum('user_role', [
  UserRoles.Member,
  UserRoles.Admin,
]);

export const table_users = pgTable('users', {
  /** The same id as in the auth table */
  id: uuid('id').primaryKey().notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: pgEnum_user_role('role').notNull().default(UserRoles.Member),

  ...timestamps,
}).enableRLS();
