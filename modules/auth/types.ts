import { UserMetadata } from '@supabase/supabase-js';

export type AuthenticatedSession = {
  isLoggedIn: true;
  user: {
    id: string;
    email: string;
    fullName: string;
    metadata: UserMetadata;
  };
};

export type UnauthenticatedSession = {
  isLoggedIn: false;
  user?: undefined;
};

export type AuthQueryResult = AuthenticatedSession | UnauthenticatedSession;
