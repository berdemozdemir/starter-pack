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
import { Paragraph1 } from '@/components/ui/typography/Paragraph';
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
            className="border-primary/50 bg-primary text-primary-foreground hover:bg-primary-hover mt-1 w-full py-5 text-sm font-semibold transition-[color,box-shadow,transform] active:translate-y-px"
            type="submit"
          >
            Sign up {signupMutation.isPending && <LoadingSpinner />}
          </Button>

          {signupMutation.error && (
            <div className="border-destructive/25 bg-destructive/10 rounded-lg border px-3 py-2 text-center">
              <Paragraph1 className="text-destructive">
                {toUserFacingSupabaseAuthMessage(signupMutation.error.message)}
              </Paragraph1>
            </div>
          )}

          <div className="border-foreground/10 border-t pt-5 text-center">
            <Paragraph1 className="text-foreground/55">
              Already have an account?{' '}
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
