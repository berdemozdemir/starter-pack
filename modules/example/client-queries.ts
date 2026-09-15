import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query';
import { okOrThrow, type ArgsOf } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';
import {
  queryClient,
  useSessionInfiniteQuery,
  useSessionQuery,
} from '@/integrations/tanstack-query/query';
import { LIST_PAGE_SIZE } from '@/lib/constants/list-page-size';
import type { CreatedAtCursor } from '@/lib/db/created-at-cursor';

export const service_example = {
  queries: {
    list: () =>
      infiniteQueryOptions({
        queryKey: orpc.example.listMine.key({ type: 'infinite' }),
        queryFn: ({ pageParam }) =>
          orpc.example.listMine
            .call({ cursor: pageParam, limit: LIST_PAGE_SIZE })
            .then(okOrThrow),
        initialPageParam: undefined as CreatedAtCursor | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
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
            queryKey: orpc.example.listMine.key(),
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
            queryKey: orpc.example.listMine.key(),
          });
          await queryClient.invalidateQueries({
            queryKey: service_example.queries.listAll().queryKey,
          });
        },
      }),
  },
} as const;

export const useExampleItemsInfiniteQuery = () =>
  useSessionInfiniteQuery(service_example.queries.list());

export const useExampleAdminItemsQuery = () =>
  useSessionQuery(service_example.queries.listAll());
