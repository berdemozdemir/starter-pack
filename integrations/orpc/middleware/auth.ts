import { getClientSession } from '@/modules/auth/actions/get-client-session';
import { ORPCError, os } from '@orpc/server';

export const middleware_auth = os.middleware(async ({ context, next }) => {
  const [authError, auth] = await getClientSession();

  if (authError) {
    throw new ORPCError('UNAUTHORIZED', { message: authError.message });
  }

  return next({
    context: {
      ...context,
      auth,
    },
  });
});
