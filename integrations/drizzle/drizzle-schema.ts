/**
 * Aggregates all Drizzle table modules for the query API.
 * Add each domain's db-tables here when you create it.
 */

import * as userSchema from '@/modules/auth/db-tables';
import * as exampleSchema from '@/modules/example/db-tables';

export const drizzleSchema = {
  ...userSchema,
  ...exampleSchema,
};
