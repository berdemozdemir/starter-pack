import { db } from '@/integrations/drizzle/drizzle-client';

/** Drizzle `db` instance type — avoid redefining it in handlers and helpers. */
export type DbClient = typeof db;
