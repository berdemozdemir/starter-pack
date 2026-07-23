import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function createQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        retry: false,
        staleTime: 1000 * 60 * 5,
      },
    },

    queryCache: new QueryCache({
      onError: (error) => {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : 'Something went wrong',
        );
      },
    }),

    mutationCache: new MutationCache({
      onError: (error) => {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : 'Something went wrong',
        );
      },
    }),
  });

  return client;
}
