import { and, eq } from 'drizzle-orm';
import { db } from '@/integrations/drizzle/drizzle-client';
import { createClient } from '@/integrations/supabase/supabase-server';
import { notDeleted } from '@/lib/db/not-deleted';
import { err, ok, tryCatchDb, type Result } from '@/lib/result';
import { table_users } from '../db-tables';
import { isUserRole, UserRoles, type UserRole } from '../types/user-role';

export type ClientSession = {
  userId: string;
  userEmail: string;
  userFullName: string;
  role: UserRole;
};

export const getClientSession = async (): Promise<
  Result<ClientSession, { reason: string; message: string }>
> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!data.user)
    return err({
      reason: 'user-is-not-logged-in',
      message: 'Not signed in',
    });

  if (error !== null)
    return err({
      message: error.message,
      reason: 'supabase-error',
    });

  if (!data.user.email)
    return err({
      message: 'Account has no email',
      reason: 'email-missing',
    });

  const [profileErr, profileRows] = await tryCatchDb(() =>
    db
      .select({
        role: table_users.role,
        name: table_users.name,
      })
      .from(table_users)
      .where(and(eq(table_users.id, data.user.id), notDeleted(table_users)))
      .limit(1),
  );

  if (profileErr)
    return err({
      reason: 'profile-load-failed',
      message: 'Could not load user profile',
    });

  const profile = profileRows[0];

  if (!profile || !isUserRole(profile.role))
    return err({
      reason: 'profile-missing',
      message: 'User profile not found',
    });

  return ok({
    userId: data.user.id,
    userEmail: data.user.email,
    userFullName: profile.name,
    role: profile.role,
  });
};

export const getAdminAuthSession = async (): Promise<
  Result<ClientSession, { reason: string; message: string }>
> => {
  const [authError, auth] = await getClientSession();

  if (authError) return err(authError);

  if (auth.role !== UserRoles.Admin)
    return err({
      reason: 'user-is-not-an-admin',
      message: 'This action requires an admin account',
    });

  return ok(auth);
};
