import { paths } from '@/lib/paths';
import { UserRole, UserRoles } from '../types/user-role';

export function homePathForRole(role: UserRole) {
  if (role === UserRoles.Admin) return paths.admin.base;
  return paths.dashboard.base;
}
