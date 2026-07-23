const LOG_PREFIX = '[starter-pack]';

export class ConsoleLogger {
  static log(...args: unknown[]) {
    console.log(formatLogInputs(args));
  }

  static info(...args: unknown[]) {
    ConsoleLogger.log(
      `\x1b[38;5;33m${LOG_PREFIX} ${formatLogInputs(args)}\x1b[0m`,
    );
  }

  static warn(...args: unknown[]) {
    ConsoleLogger.log(
      `\x1b[38;5;208m${LOG_PREFIX} ${formatLogInputs(args)}\x1b[0m`,
    );
  }

  static success(...args: unknown[]) {
    ConsoleLogger.log(`\x1b[32m${LOG_PREFIX} ${formatLogInputs(args)} \x1b[0m`);
  }

  static error(...args: unknown[]) {
    ConsoleLogger.log(`\x1b[31m${LOG_PREFIX} ${formatLogInputs(args)} \x1b[0m`);
  }
}

export function formatLogInputs(inputs: unknown[]): string {
  return inputs.map(formatLogInput).join('\n');
}

export function formatLogInput(input: unknown): string {
  if (typeof input === 'string') return input;
  if (input instanceof Error) {
    return JSON.stringify(
      { name: input.name, message: input.message, stack: input.stack },
      null,
      2,
    );
  }
  if (typeof input === 'object') return JSON.stringify(input, null, 2);
  return String(input);
}
