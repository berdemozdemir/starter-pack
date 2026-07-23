import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { okOrThrow, type ArgsOf } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';
import {
  queryClient,
  useSessionQuery,
} from '@/integrations/tanstack-query/query';

export const service_example = {
  queries: {
    list: () =>
      queryOptions({
        queryKey: orpc.example.listMine.queryOptions().queryKey,
        queryFn: () => orpc.example.listMine.call().then(okOrThrow),
      }),
  },
  mutations: {
    create: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.example.create.call>) =>
          orpc.example.create.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_example.queries.list().queryKey,
          });
        },
      }),

    delete: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.example.delete.call>) =>
          orpc.example.delete.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_example.queries.list().queryKey,
          });
        },
      }),
  },
} as const;

export const useExampleItemsQuery = () =>
  useSessionQuery(service_example.queries.list());
