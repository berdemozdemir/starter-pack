'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/Form';
import { paths } from '@/lib/paths';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Paragraph1, Paragraph2 } from '@/components/ui/typography/Paragraph';
import { AuthFormShell } from './AuthFormShell';
import { LabeledInput } from './LabeledInput';
import { useMutation } from '@tanstack/react-query';
import { service_auth } from '../client-queries';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { loginFormSchema, LoginFormSchemaRequest } from '../schemas/login';
import { toUserFacingSupabaseAuthMessage } from '../utils/supabase-auth-message';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/integrations/tanstack-query/query';
import { homePathForRole } from '../utils/home-path-for-role';
import type { AuthQueryResult } from '../types';

const supabase = createSupabaseBrowserClient();

export const LoginForm = () => {
  const router = useRouter();

  const loginMutation = useMutation(service_auth.mutations.login());

  const form = useForm<LoginFormSchemaRequest>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submit = form.handleSubmit(async (data: LoginFormSchemaRequest) => {
    await loginMutation.mutateAsync(data);

    await supabase.auth.refreshSession();

    await queryClient.refetchQueries({
      queryKey: service_auth.queries.auth().queryKey,
    });

    const auth = queryClient.getQueryData<AuthQueryResult>(
      service_auth.queries.auth().queryKey,
    );

    toast.success('Signed in successfully');

    if (auth?.isLoggedIn) router.push(homePathForRole(auth.user.role));
    else router.push(paths.dashboard.base);
  });

  return (
    <Form {...form}>
      <AuthFormShell
        title="Welcome back"
        subtitle="Sign in to continue to your dashboard."
      >
        <form className="space-y-4" onSubmit={submit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput {...field} label="Email" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput isPasswordField {...field} label="Password" />
                </FormControl>

                <FormMessage />

                <Paragraph2 className="text-foreground/55 mt-1 text-right">
                  <Link
                    className="hover:text-primary underline-offset-4 transition-colors hover:underline"
                    href={paths.auth.forgotPassword}
                  >
                    Forgot your password?
                  </Link>
                </Paragraph2>
              </FormItem>
            )}
          />

          <Button
            disabled={loginMutation.isPending}
            className="border-primary/50 bg-primary text-primary-foreground hover:bg-primary-hover mt-1 w-full py-5 text-sm font-semibold transition-[color,box-shadow,transform] active:translate-y-px"
            type="submit"
          >
            Sign in {loginMutation.isPending && <LoadingSpinner />}
          </Button>

          {loginMutation.error && (
            <div className="border-destructive/25 bg-destructive/10 rounded-lg border px-3 py-2 text-center">
              <Paragraph1 className="text-destructive">
                {toUserFacingSupabaseAuthMessage(loginMutation.error.message)}
              </Paragraph1>
            </div>
          )}

          <div className="border-foreground/10 border-t pt-5 text-center">
            <Paragraph1 className="text-foreground/55">
              Don&apos;t have an account?{' '}
              <Link
                className="text-primary hover:text-primary-hover font-medium underline-offset-4 transition-colors hover:underline"
                href={paths.auth.signup}
              >
                Sign up
              </Link>
            </Paragraph1>
          </div>
        </form>
      </AuthFormShell>
    </Form>
  );
};
