export const UserRoles = {
  Member: 'member',
  Admin: 'admin',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export function getUserRoles(): readonly UserRole[] {
  return Object.values(UserRoles);
}

export function isUserRole(value: string): value is UserRole {
  return getUserRoles().includes(value as UserRole);
}
