'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
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
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormSchemaRequest,
} from '../schemas/forgot-password';
import { toUserFacingSupabaseAuthMessage } from '../utils/supabase-auth-message';

export const ForgotPasswordForm = () => {
  const searchParams = useSearchParams();

  const requestResetMutation = useMutation(
    service_auth.mutations.requestPasswordReset(),
  );

  useEffect(() => {
    const error = searchParams.get('error');

    if (!error) return;

    toast.error(toUserFacingSupabaseAuthMessage(error));
  }, [searchParams]);

  const form = useForm<ForgotPasswordFormSchemaRequest>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const submit = form.handleSubmit(
    async (data: ForgotPasswordFormSchemaRequest) => {
      await requestResetMutation.mutateAsync(data);
    },
  );

  if (requestResetMutation.isSuccess) {
    return (
      <AuthFormShell
        title="Check your email"
        subtitle="A password reset link was sent to your email. Check your inbox and spam folder."
      >
        <div className="space-y-4 text-center">
          <p className="text-cream/65 text-sm leading-relaxed">
            After you open the link, you can set a new password.
          </p>

          <Link
            className="text-gold hover:text-gold-light inline-block text-sm font-medium underline-offset-4 transition-colors hover:underline"
            href={paths.auth.login}
          >
            Back to sign in
          </Link>
        </div>
      </AuthFormShell>
    );
  }

  return (
    <Form {...form}>
      <AuthFormShell
        title="Forgot your password?"
        subtitle="Enter your email and we will send you a reset link."
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

          <Button
            disabled={requestResetMutation.isPending}
            className="border-gold/50 bg-gold text-deep hover:bg-gold-light hover:text-deep mt-1 w-full py-5 text-sm font-semibold shadow-[0_8px_24px_-4px_rgba(212,175,55,0.35)] transition-[color,box-shadow,transform] hover:shadow-[0_10px_28px_-4px_rgba(212,175,55,0.45)] active:translate-y-px"
            type="submit"
          >
            Send reset link{' '}
            {requestResetMutation.isPending && <LoadingSpinner />}
          </Button>

          {requestResetMutation.error && (
            <div className="text-destructive border-destructive/25 bg-destructive/10 rounded-lg border px-3 py-2 text-center text-sm">
              {toUserFacingSupabaseAuthMessage(
                requestResetMutation.error.message,
              )}
            </div>
          )}

          <div className="text-cream/55 border-t border-white/10 pt-5 text-center text-sm">
            Remember your password?{' '}
            <Link
              className="text-gold hover:text-gold-light font-medium underline-offset-4 transition-colors hover:underline"
              href={paths.auth.login}
            >
              Sign in
            </Link>
          </div>
        </form>
      </AuthFormShell>
    </Form>
  );
};
