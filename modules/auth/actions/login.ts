import { procedure_public } from '@/integrations/orpc/procedure';
import { createClient } from '@/integrations/supabase/supabase-server';
import { err, ok } from '@/lib/result';
import { loginFormSchema } from '../schemas/login';

export const orpc_login = procedure_public
  .input(loginFormSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();

    let result;

    try {
      result = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return err({
          message: error.message,
          reason: 'login-error',
        });
      }

      return err({
        message: 'Something went wrong while signing in',
        reason: 'login-error',
      });
    }

    if (result.error) {
      return err({
        message: result.error.message,
        reason: 'login-error',
      });
    }

    return ok({
      user: result.data.user,
      message: 'Signed in successfully',
    });
  });
