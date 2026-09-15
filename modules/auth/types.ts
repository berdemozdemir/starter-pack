import { UserMetadata } from '@supabase/supabase-js';
import type { UserRole } from './types/user-role';

export type AuthenticatedSession = {
  isLoggedIn: true;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    metadata: UserMetadata;
  };
};

export type UnauthenticatedSession = {
  isLoggedIn: false;
  user?: undefined;
};

export type AuthQueryResult = AuthenticatedSession | UnauthenticatedSession;
