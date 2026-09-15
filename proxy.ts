import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/integrations/supabase/middleware';
import { paths } from '@/lib/paths';
import { createClient } from './integrations/supabase/supabase-server';

export async function proxy(request: NextRequest) {
  return runMiddleware(request, [useSessionMiddleware, useAuthMiddleware]);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

type Middleware = (
  _request: NextRequest,
  _response: NextResponse,
) => Promise<NextResponse>;

/** Runs given middleware on the given request in order */
async function runMiddleware(request: NextRequest, middlewares: Middleware[]) {
  let response = NextResponse.next();

  for (const middleware of middlewares) {
    const newResponse = await middleware(request, response);

    if (newResponse) {
      response = newResponse;

      if (newResponse.status === 307 || newResponse.status === 308) {
        return newResponse;
      }
    }
  }

  return response;
}

async function useSessionMiddleware(
  request: NextRequest,
  _response: NextResponse,
) {
  return updateSession(request);
}

/**
 * Authenticated users cannot view the marketing home page; send them to the dashboard.
 */
async function useAuthMiddleware(request: NextRequest, response: NextResponse) {
  const protectedPages = [paths.dashboard.base] as const;
  const guestOnlyAuthPages = [
    paths.auth.login,
    paths.auth.signup,
    paths.auth.forgotPassword,
  ] as const;

  const isAccessingProtectedPage =
    protectedPages.filter((pageUrl) =>
      request.nextUrl.pathname.startsWith(pageUrl),
    ).length > 0;

  const isAccessingLandingPage = request.nextUrl.pathname === '/';

  const isAccessingGuestOnlyAuthPage =
    guestOnlyAuthPages.filter((pageUrl) =>
      request.nextUrl.pathname.startsWith(pageUrl),
    ).length > 0;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const isLoggedIn = !error && !!data.user;

  // redirect unauthenticated users attempting to access protected pages to login (with callback)
  if (!isLoggedIn && isAccessingProtectedPage) {
    const callbackUrl = request.nextUrl.pathname;
    return NextResponse.redirect(
      new URL(`${paths.auth.login}?callback_url=${callbackUrl}`, request.url),
    );
  }

  // authenticated users should not go to the landing page
  if (isLoggedIn && isAccessingLandingPage)
    return NextResponse.redirect(new URL(paths.dashboard.base, request.url));

  // authenticated users should not go to login/signup/forgot-password
  if (isLoggedIn && isAccessingGuestOnlyAuthPage)
    return NextResponse.redirect(new URL(paths.dashboard.base, request.url));

  // otherwise, everything is a-ok.
  return response;
}
