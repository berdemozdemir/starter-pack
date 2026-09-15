import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';
import { getClientSession } from '../actions/get-client-session';
import { UserRoles } from '../types/user-role';
import { homePathForRole } from './home-path-for-role';

export async function requireAuth() {
  const [authErr, auth] = await getClientSession();

  if (authErr) {
    if (authErr.reason === 'user-is-not-logged-in') redirect(paths.auth.login);
    redirect(paths.unauthorized);
  }

  return auth;
}

export async function requireAdmin() {
  const auth = await requireAuth();

  if (auth.role !== UserRoles.Admin) redirect(homePathForRole(auth.role));

  return auth;
}
