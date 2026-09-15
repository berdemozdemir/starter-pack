'use client';

import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { createQueryClient } from './query-client';
import { useAuthQuery } from '@/modules/auth/client-queries';

export const queryClient = createQueryClient();

/** Sends request without requiring session */
export const usePublicQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = readonly unknown[],
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) => {
  return useQuery({
    ...options,
  });
};

/** only runs when user is logged in */
export const useSessionQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = readonly unknown[],
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) => {
  const authQuery = useAuthQuery();

  return useQuery({
    ...options,
    enabled:
      !authQuery.isFetching &&
      authQuery.data?.isLoggedIn &&
      (options.enabled === undefined ? true : options.enabled),
  });
};

/** only runs when user is logged in */
export const useSessionInfiniteQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = readonly unknown[],
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) => {
  const authQuery = useAuthQuery();

  return useInfiniteQuery({
    ...options,
    enabled:
      !authQuery.isFetching &&
      authQuery.data?.isLoggedIn &&
      (options.enabled === undefined ? true : options.enabled),
  });
};
