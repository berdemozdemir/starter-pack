import { config } from 'dotenv';
import prompt from '@/scripts/utils/prompt';
import { runMigration } from './migrate-utils';
import { ConsoleLogger } from '@/scripts/utils/console-logger';

config({ path: '.env.local', quiet: true });

if (!process.env.DATABASE_URL) {
  ConsoleLogger.error(
    '[migrate] DATABASE_URL is missing (expected in .env.local)',
  );
  process.exit(1);
}

prompt({
  message: `DANGER 💥💥💥 You are going to migrate REMOTE database: (${process.env.DATABASE_URL})
Are you sure?`,
  condition: !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL),
  onCancel: () => {
    ConsoleLogger.error('[migrate] Migration cancelled.');
    process.exit(1);
  },
  onAccept: () => {
    void runMigration();
  },
});
