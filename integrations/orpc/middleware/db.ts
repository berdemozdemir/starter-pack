import { db } from '@/integrations/drizzle/drizzle-client';
import { os } from '@orpc/server';

export const middleware_db = os.middleware(async ({ next }) => {
  return next({
    context: {
      db,
    },
  });
});
