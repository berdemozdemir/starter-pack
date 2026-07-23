'use client';

import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { cache } from 'react';
import { createQueryClient } from './query-client';
import { useAuthQuery } from '@/modules/auth/client-queries';

// cached to create one client instance
export const queryClient = cache(createQueryClient)();

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
