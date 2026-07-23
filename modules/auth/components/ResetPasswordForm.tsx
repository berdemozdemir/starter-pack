'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  resetPasswordFormSchema,
  ResetPasswordFormSchemaRequest,
} from '../schemas/reset-password';
import { toUserFacingSupabaseAuthMessage } from '../utils/supabase-auth-message';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';

const supabase = createSupabaseBrowserClient();

export const ResetPasswordForm = () => {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  const updatePasswordMutation = useMutation(
    service_auth.mutations.updatePassword(),
  );

  const form = useForm<ResetPasswordFormSchemaRequest>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  const submit = form.handleSubmit(
    async (data: ResetPasswordFormSchemaRequest) => {
      await updatePasswordMutation.mutateAsync(data);

      toast.success('Password updated.');

      router.push(paths.dashboard.base);
    },
  );

  if (hasSession === null) {
    return (
      <AuthFormShell
        title="Set a new password"
        subtitle="Verifying your session..."
      >
        <div className="flex justify-center py-6">
          <LoadingSpinner />
        </div>
      </AuthFormShell>
    );
  }

  if (!hasSession) {
    return (
      <AuthFormShell
        title="Link invalid"
        subtitle="Your password reset link is expired or invalid. Please request a new one."
      >
        <div className="space-y-4 text-center">
          <Link
            className="text-gold hover:text-gold-light inline-block text-sm font-medium underline-offset-4 transition-colors hover:underline"
            href={paths.auth.forgotPassword}
          >
            Request a new reset link
          </Link>
        </div>
      </AuthFormShell>
    );
  }

  return (
    <Form {...form}>
      <AuthFormShell
        title="Set a new password"
        subtitle="Choose a strong password for your account."
      >
        <form className="space-y-4" onSubmit={submit}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput
                    isPasswordField
                    {...field}
                    label="New password"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput
                    isPasswordField
                    {...field}
                    label="Confirm new password"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={updatePasswordMutation.isPending}
            className="border-gold/50 bg-gold text-deep hover:bg-gold-light hover:text-deep mt-1 w-full py-5 text-sm font-semibold shadow-[0_8px_24px_-4px_rgba(212,175,55,0.35)] transition-[color,box-shadow,transform] hover:shadow-[0_10px_28px_-4px_rgba(212,175,55,0.45)] active:translate-y-px"
            type="submit"
          >
            Update password{' '}
            {updatePasswordMutation.isPending && <LoadingSpinner />}
          </Button>

          {updatePasswordMutation.error && (
            <div className="text-destructive border-destructive/25 bg-destructive/10 rounded-lg border px-3 py-2 text-center text-sm">
              {toUserFacingSupabaseAuthMessage(
                updatePasswordMutation.error.message,
              )}
            </div>
          )}
        </form>
      </AuthFormShell>
    </Form>
  );
};
