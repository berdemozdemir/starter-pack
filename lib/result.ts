export type Result<Success, Err extends { reason: string }> =
  [Err, null] | [null, Success];

/** Shared error body used by protected procedures and similar RPC handlers */
export type StandardRpcError = { reason: string; message: string };

/** Shorthand for the first (and only) parameter type of a function */
export type ArgsOf<T extends (...args: never[]) => unknown> = Parameters<T>[0];

export function ok<Success>(data: Success): Result<Success, never> {
  return [null, data];
}

export function err<Err extends { reason: string }>(
  error: Err,
): Result<never, Err> {
  return [error, null];
}

type AnyResult = Result<unknown, { reason: string }>;
type OkValue<R extends AnyResult> = R extends [null, infer S] ? S : never;

export function okOrThrow<R extends AnyResult>(result: R): OkValue<R> {
  if (result[0] !== null) {
    const error = result[0];
    if ('message' in error && typeof error.message === 'string') {
      throw new Error(error.message, { cause: error });
    }
  }

  const data = result[1];

  if (data === null) {
    throw new Error('Invalid state: received [null, null] as result', {
      cause: result,
    });
  }

  return data as OkValue<R>;
}

export async function tryCatch<Success>(promise: () => Promise<Success>) {
  try {
    const data = await promise();
    return ok(data);
  } catch (error) {
    if (error instanceof Error) {
      return err({
        message: error.message,

        /** If you see this error code, it means you potentially returned a
         * tryCatch error to the client. This can reveal sensitive info such as
         * env variables. */
        reason: 'YOU-SHOULD-NOT-SEE-THIS-ERROR-CODE (try-catch)',
        originalError: error,
      });
    }

    return err({
      message: `An unknown error occurred. ${error}`,

      /** If you see this error code, it means you potentially returned a
       * tryCatch error to the client. This can reveal sensitive info such as
       * env variables. */
      reason: 'YOU-SHOULD-NOT-SEE-THIS-ERROR-CODE (try-catch)',
      originalError: error,
    });
  }
}

/** use this for wrapping database calls */
export async function tryCatchDb<Success>(promise: () => Promise<Success>) {
  try {
    const data = await promise();
    return ok(data);
  } catch (error) {
    if (
      error instanceof Error &&
      'cause' in error &&
      error.cause !== null &&
      typeof error.cause === 'object' &&
      'message' in error.cause
    ) {
      return err({
        message: error.message,

        /** If you see this error code, it means you potentially returned a
         * tryCatch error to the client. This can reveal sensitive info such as
         * env variables. */
        reason: 'YOU-SHOULD-NOT-SEE-THIS-ERROR-CODE (try-catch-db)',

        /** detailed DB error is usually here */
        cause: error.cause.message,
        originalError: error,
      });
    }

    return err({
      message: `An unknown error occurred. ${error}`,

      /** If you see this error code, it means you potentially returned a
       * tryCatch error to the client. This can reveal sensitive info such as
       * env variables. */
      reason: 'YOU-SHOULD-NOT-SEE-THIS-ERROR-CODE (try-catch-db)',
      originalError: error,
    });
  }
}

export function tryCatchSync<Success>(fn: () => Success) {
  try {
    const data = fn();
    return ok(data);
  } catch (error) {
    if (error instanceof Error) {
      return err({
        message: error.message,

        /** If you see this error code, it means you potentially returned a
         * tryCatch error to the client. This can reveal sensitive info such as
         * env variables. */
        reason: 'YOU-SHOULD-NOT-SEE-THIS-ERROR-CODE (try-catch-sync)',
        originalError: error,
      });
    }

    return err({
      message: `An unknown error occurred. ${error}`,

      /** If you see this error code, it means you potentially returned a
       * tryCatch error to the client. This can reveal sensitive info such as
       * env variables. */
      reason: 'YOU-SHOULD-NOT-SEE-THIS-ERROR-CODE (try-catch-sync)',
      originalError: error,
    });
  }
}
