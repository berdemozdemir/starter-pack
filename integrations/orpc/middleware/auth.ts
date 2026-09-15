import {
  getAdminAuthSession,
  getClientSession,
} from '@/modules/auth/actions/get-client-session';
import { ORPCError, os } from '@orpc/server';

export const middleware_auth = os.middleware(async ({ context, next }) => {
  const [authError, auth] = await getClientSession();

  if (authError)
    throw new ORPCError('UNAUTHORIZED', { message: authError.message });

  return next({
    context: {
      ...context,
      auth,
    },
  });
});

export const middleware_adminAuth = os.middleware(async ({ context, next }) => {
  const [authErr, auth] = await getAdminAuthSession();

  if (authErr) throw new ORPCError('FORBIDDEN', { message: authErr.message });

  return next({
    context: {
      ...context,
      auth,
    },
  });
});
