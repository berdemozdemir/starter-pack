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
import { Paragraph1, Paragraph2 } from '@/components/ui/typography/Paragraph';
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
          <Paragraph1 className="text-foreground/65 leading-relaxed">
            After you open the link, you can set a new password.
          </Paragraph1>

          <Paragraph2 className="text-center">
            <Link
              className="text-primary hover:text-primary-hover inline-block font-medium underline-offset-4 transition-colors hover:underline"
              href={paths.auth.login}
            >
              Back to sign in
            </Link>
          </Paragraph2>
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
            className="border-primary/50 bg-primary text-primary-foreground hover:bg-primary-hover mt-1 w-full py-5 text-sm font-semibold transition-[color,box-shadow,transform] active:translate-y-px"
            type="submit"
          >
            Send reset link{' '}
            {requestResetMutation.isPending && <LoadingSpinner />}
          </Button>

          {requestResetMutation.error && (
            <div className="border-destructive/25 bg-destructive/10 rounded-lg border px-3 py-2 text-center">
              <Paragraph1 className="text-destructive">
                {toUserFacingSupabaseAuthMessage(
                  requestResetMutation.error.message,
                )}
              </Paragraph1>
            </div>
          )}

          <div className="border-foreground/10 border-t pt-5 text-center">
            <Paragraph1 className="text-foreground/55">
              Remember your password?{' '}
              <Link
                className="text-primary hover:text-primary-hover font-medium underline-offset-4 transition-colors hover:underline"
                href={paths.auth.login}
              >
                Sign in
              </Link>
            </Paragraph1>
          </div>
        </form>
      </AuthFormShell>
    </Form>
  );
};
