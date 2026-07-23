import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { router } from './router';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { headers } from 'next/headers';

const link = new RPCLink({
  url: async () => {
    const h = await headers();
    const proto = h.get('X-Forwarded-Proto') ?? 'http';
    const host = h.get('X-Forwarded-Host') ?? h.get('host') ?? 'localhost:3000';
    return `${proto}://${host}/api/rpc`;
  },
  headers: async () => ({}),
});

const orpcServerClient: RouterClient<typeof router> = createORPCClient(link);
export const orpcServer = createTanstackQueryUtils(orpcServerClient);
