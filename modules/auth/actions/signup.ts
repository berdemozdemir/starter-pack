import { UserMetadata } from '@supabase/supabase-js';
import { procedure_public } from '@/integrations/orpc/procedure';
import {
  createAdminClient,
  createClient,
} from '@/integrations/supabase/supabase-server';
import { err, ok, tryCatchDb } from '@/lib/result';
import { signupFormSchema } from '../schemas/signup';
import { table_users } from '../db-tables';

export const orpc_signup = procedure_public
  .input(signupFormSchema)
  .handler(async ({ input, context: { db } }) => {
    const supabase = await createClient();

    const result = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.fullName,
        },
      },
    });

    if (result.error)
      return err({
        reason: 'auth-error',
        message: result.error.message,
      });

    const user = result.data.user;

    if (!user)
      return err({
        reason: 'user-creation-failed',
        message: 'Could not create user',
      });

    if (user.identities?.length === 0)
      return err({
        reason: 'user-already-exists',
        message: 'An account with this email already exists',
      });

    const [insertProfileError] = await tryCatchDb(() =>
      db.insert(table_users).values({
        id: user.id,
        email: user.email ?? input.email,
        name: input.fullName,
      }),
    );

    if (insertProfileError)
      return err({
        reason: 'profile-creation-failed',
        message: insertProfileError.message,
      });

    const supabaseAdmin = createAdminClient({
      options: {
        auth: {
          persistSession: false,
        },
      },
    });

    const userMetadata: UserMetadata = {
      ...user.user_metadata,
      name: input.fullName,
    };

    const { error: metadataError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: userMetadata,
      });

    if (metadataError)
      return err({
        reason: 'user-metadata-update-failed',
        message: metadataError.message,
      });

    return ok({
      userId: user.id,
      email: user.email,
      message: 'Signed up successfully',
    });
  });
