'use client';

import { RPCLink } from '@orpc/client/fetch';
import { RouterClient } from '@orpc/server';
import { router } from './router';
import { createORPCClient } from '@orpc/client';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';

const link = new RPCLink({
  url: () => {
    if (typeof window === 'undefined') {
      throw new Error(
        'oRPC client cannot be used during SSR. Use server actions directly or ensure this code only runs on the client.',
      );
    }

    return `${window.location.origin}/api/rpc`;
  },
  headers: async () => ({}),
});

const orpcClient: RouterClient<typeof router> = createORPCClient(link);
export const orpc = createTanstackQueryUtils(orpcClient);
