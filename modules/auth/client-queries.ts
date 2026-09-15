import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { ArgsOf, okOrThrow } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { AuthQueryResult } from './types';
import {
  queryClient,
  usePublicQuery,
} from '@/integrations/tanstack-query/query';
import { useRouter } from 'next/navigation';
import { paths } from '@/lib/paths';
import { resolveMetadataBase } from '@/lib/utils/resolve-metadata';
import { ForgotPasswordFormSchemaRequest } from './schemas/forgot-password';
import { ResetPasswordFormSchemaRequest } from './schemas/reset-password';

const supabase = createSupabaseBrowserClient();

export const service_auth = {
  queries: {
    auth: () =>
      queryOptions<AuthQueryResult>({
        queryKey: orpc.auth.getAuthSession.queryOptions().queryKey,
        gcTime: 1000 * 60 * 60 * 5,
        queryFn: async () => {
          const {
            data: { session: supabaseSession },
          } = await supabase.auth.getSession();

          if (!supabaseSession) return { isLoggedIn: false };

          const [sessionErr, sessionData] =
            await orpc.auth.getAuthSession.call();

          if (sessionErr) {
            const errorReason = sessionErr.reason;

            switch (errorReason) {
              case 'supabase-error':
              case 'email-missing':
              case 'user-is-not-logged-in':
                await supabase.auth.signOut();
                return { isLoggedIn: false };
              default:
                throw new Error(errorReason);
            }
          }

          return {
            isLoggedIn: true,
            user: {
              id: sessionData.userId,
              email: sessionData.userEmail,
              fullName: sessionData.userFullName,
              metadata: supabaseSession.user?.user_metadata,
            },
          };
        },
      }),
  },

  mutations: {
    login: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.auth.login.call>) =>
          orpc.auth.login.call(args).then(okOrThrow),
        onSettled: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_auth.queries.auth().queryKey,
          });
        },
      }),

    signup: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.auth.signup.call>) =>
          orpc.auth.signup.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.refetchQueries({
            queryKey: service_auth.queries.auth().queryKey,
          });
        },
      }),

    requestPasswordReset: () =>
      mutationOptions({
        mutationFn: async (args: ForgotPasswordFormSchemaRequest) => {
          const next = encodeURIComponent(paths.auth.resetPassword);
          const redirectTo = `${resolveMetadataBase().origin}${paths.auth.callback}?next=${next}`;

          const { error } = await supabase.auth.resetPasswordForEmail(
            args.email,
            { redirectTo },
          );

          if (error) throw new Error(error.message);
        },
      }),

    updatePassword: () =>
      mutationOptions({
        mutationFn: async (args: ResetPasswordFormSchemaRequest) => {
          const { error } = await supabase.auth.updateUser({
            password: args.password,
          });

          if (error) throw new Error(error.message);
        },
        onSettled: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_auth.queries.auth().queryKey,
          });
        },
      }),

    logout: (args: { router: ReturnType<typeof useRouter> }) =>
      mutationOptions({
        mutationFn: async () => {
          const { error } = await supabase.auth.signOut();

          if (error) throw new Error(error.message);

          queryClient.removeQueries();

          args.router.push(paths.home);
        },
        onError: async (error) => {
          console.error(error);

          args.router.push(paths.auth.login);

          queryClient.removeQueries();
        },
      }),
  },
} as const;

export const useAuthQuery = () => usePublicQuery(service_auth.queries.auth());
