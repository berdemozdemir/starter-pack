import { ConsoleLogger } from '@/scripts/utils/console-logger';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

type ExecError = Error & { stdout?: string; stderr?: string; code?: number };

function logExecFailure(err: unknown) {
  ConsoleLogger.error('[migrate] Migration failed');

  if (err instanceof Error) {
    ConsoleLogger.error(err.message);
  }

  if (err && typeof err === 'object') {
    const { stdout, stderr, code } = err as ExecError;
    if (code !== undefined) ConsoleLogger.error(`exit code: ${code}`);
    if (stdout?.trim()) ConsoleLogger.error('stdout:', stdout.trim());
    if (stderr?.trim()) ConsoleLogger.error('stderr:', stderr.trim());
    return;
  }

  ConsoleLogger.error('[migrate] ERROR:', err);
}

export const runMigration = async () => {
  ConsoleLogger.info('[migrate] starting...');

  try {
    const { stdout, stderr } = await execPromise(
      'pnpm exec drizzle-kit migrate',
    );

    if (stdout?.trim()) {
      ConsoleLogger.log(stdout.trim());
    }

    if (stderr?.trim()) {
      ConsoleLogger.log(stderr.trim());
    }

    ConsoleLogger.success('[migrate] Migrations complete');
  } catch (err) {
    logExecFailure(err);
    process.exit(1);
  }
};
