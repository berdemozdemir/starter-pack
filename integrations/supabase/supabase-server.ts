import { createServerClient } from '@supabase/ssr';
import {
  createClient as createSupabaseClient,
  SupabaseClientOptions,
} from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const createClient = async (args?: {
  options?: SupabaseClientOptions<'public'>;
}) => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      ...args?.options,
    },
  );
};

/**
 * Service-role client — does NOT carry the user's session cookies.
 * An admin client with SSR cookies can mix the session JWT into Storage signed-URL
 * flows and trip RLS (broken images while signed in; works in a private window).
 */
export const createAdminClient = (args?: {
  options?: SupabaseClientOptions<'public'>;
}) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    ...args?.options,
  });
};
