import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  out: './database/migrations',
  schema: [
    './database/schema/**',
    '**/db-tables.ts',
    '**/db-relations.ts',
    '**/db-enums.ts',
    '**/db-tables/**.ts',
    '**/db-relations/**.ts',
    '**/db-enums/**.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
});
