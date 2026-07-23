import { config } from 'dotenv';
import { ConsoleLogger } from '@/scripts/utils/console-logger';
import { runMigration } from './migrate-utils';

config({ path: '.env.local', quiet: true });

if (!process.env.DATABASE_URL) {
  ConsoleLogger.error(
    '[migrate] DATABASE_URL is missing (expected in .env.local)',
  );
  process.exit(1);
}

void runMigration();
