'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { signupFormSchema, SignupFormSchemaRequest } from '../schemas/signup';
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
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { useRouter } from 'next/navigation';
import { service_auth } from '../client-queries';
import { toUserFacingSupabaseAuthMessage } from '../utils/supabase-auth-message';

export const SignUpForm = () => {
  const router = useRouter();

  const signupMutation = useMutation(service_auth.mutations.signup());

  const form = useForm<SignupFormSchemaRequest>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const submit = form.handleSubmit(async (data: SignupFormSchemaRequest) => {
    const supabase = createSupabaseBrowserClient();

    await signupMutation.mutateAsync(data);

    await supabase.auth.refreshSession();

    toast.success('Account created. You are signed in.');

    router.push(paths.dashboard.base);
  });

  return (
    <Form {...form}>
      <AuthFormShell
        title="Create an account"
        subtitle="Sign up to start building on this starter pack."
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
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput {...field} label="Full name" />
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
                    label="Confirm password"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={signupMutation.isPending}
            className="border-gold/50 bg-gold text-deep hover:bg-gold-light hover:text-deep mt-1 w-full py-5 text-sm font-semibold shadow-[0_8px_24px_-4px_rgba(212,175,55,0.35)] transition-[color,box-shadow,transform] hover:shadow-[0_10px_28px_-4px_rgba(212,175,55,0.45)] active:translate-y-px"
            type="submit"
          >
            Sign up {signupMutation.isPending && <LoadingSpinner />}
          </Button>

          {signupMutation.error && (
            <div className="text-destructive border-destructive/25 bg-destructive/10 rounded-lg border px-3 py-2 text-center text-sm">
              {toUserFacingSupabaseAuthMessage(signupMutation.error.message)}
            </div>
          )}

          <div className="text-cream/55 border-t border-white/10 pt-5 text-center text-sm">
            Already have an account?{' '}
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
