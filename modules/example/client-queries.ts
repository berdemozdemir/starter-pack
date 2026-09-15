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
    listAll: () =>
      queryOptions({
        queryKey: orpc.example.listAll.queryOptions().queryKey,
        queryFn: () => orpc.example.listAll.call().then(okOrThrow),
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
          await queryClient.invalidateQueries({
            queryKey: service_example.queries.listAll().queryKey,
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
          await queryClient.invalidateQueries({
            queryKey: service_example.queries.listAll().queryKey,
          });
        },
      }),
  },
} as const;

export const useExampleItemsQuery = () =>
  useSessionQuery(service_example.queries.list());

export const useExampleAdminItemsQuery = () =>
  useSessionQuery(service_example.queries.listAll());
