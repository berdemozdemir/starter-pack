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

    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData.session?.user) {
      queryClient.setQueryData(service_auth.queries.auth().queryKey, {
        isLoggedIn: true,
        user: {
          id: sessionData.session?.user.id,
          email: sessionData.session?.user.email ?? '',
          fullName:
            (sessionData.session?.user.user_metadata?.name as string) ?? '',
          metadata: sessionData.session?.user.user_metadata ?? {},
        },
      });
    }

    toast.success('Signed in successfully');

    router.push(paths.dashboard.base);
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

                <div className="mt-1 text-right">
                  <Link
                    className="text-cream/55 hover:text-gold text-xs underline-offset-4 transition-colors hover:underline"
                    href={paths.auth.forgotPassword}
                  >
                    Forgot your password?
                  </Link>
                </div>
              </FormItem>
            )}
          />

          <Button
            disabled={loginMutation.isPending}
            className="border-gold/50 bg-gold text-deep hover:bg-gold-light hover:text-deep mt-1 w-full py-5 text-sm font-semibold shadow-[0_8px_24px_-4px_rgba(212,175,55,0.35)] transition-[color,box-shadow,transform] hover:shadow-[0_10px_28px_-4px_rgba(212,175,55,0.45)] active:translate-y-px"
            type="submit"
          >
            Sign in {loginMutation.isPending && <LoadingSpinner />}
          </Button>

          {loginMutation.error && (
            <div className="text-destructive border-destructive/25 bg-destructive/10 rounded-lg border px-3 py-2 text-center text-sm">
              {toUserFacingSupabaseAuthMessage(loginMutation.error.message)}
            </div>
          )}

          <div className="text-cream/55 border-t border-white/10 pt-5 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              className="text-gold hover:text-gold-light font-medium underline-offset-4 transition-colors hover:underline"
              href={paths.auth.signup}
            >
              Sign up
            </Link>
          </div>
        </form>
      </AuthFormShell>
    </Form>
  );
};
