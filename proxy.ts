import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';
import { db } from '@/integrations/drizzle/drizzle-client';
import { updateSession } from '@/integrations/supabase/middleware';
import { notDeleted } from '@/lib/db/not-deleted';
import { getUserLocaleFromRequest } from '@/lib/i18n/helpers';
import { isSupportedLocaleCode, LOCALE_COOKIE_KEY } from '@/lib/i18n/config';
import { paths } from '@/lib/paths';
import { table_users } from '@/modules/auth/db-tables';
import { isUserRole, UserRoles } from '@/modules/auth/types/user-role';
import { homePathForRole } from '@/modules/auth/utils/home-path-for-role';
import { tryCatchDb } from '@/lib/result';
import { createClient } from './integrations/supabase/supabase-server';

const I18N_PATHNAME_REGEXP = pathToRegexp(
  '/((?!_next|api|_vercel|monitoring|rpc|.*\\..*).*)',
);

export async function proxy(request: NextRequest) {
  return runMiddleware(request, [
    useSessionMiddleware,
    useAuthMiddleware,
    useI18nMiddleware,
  ]);
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

      if (newResponse.status === 307 || newResponse.status === 308)
        return newResponse;
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

async function useAuthMiddleware(request: NextRequest, response: NextResponse) {
  const pathname = pathnameWithoutLocale(request.nextUrl.pathname);
  const isAccessingDashboard = pathname.startsWith(paths.dashboard.base);
  const isAccessingAdmin = pathname.startsWith(paths.admin.base);
  const isAccessingProtectedPage = isAccessingDashboard || isAccessingAdmin;
  const isAccessingLandingPage = pathname === '/';
  const isAccessingGuestOnlyAuthPage =
    pathname === paths.auth.login ||
    pathname === paths.auth.signup ||
    pathname === paths.auth.forgotPassword;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const isLoggedIn = !error && !!data.user;

  if (!isLoggedIn && isAccessingProtectedPage) {
    const loginPath = `${paths.auth.login}?callback_url=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  if (!isLoggedIn) return response;

  const [profileErr, rows] = await tryCatchDb(() =>
    db
      .select({ role: table_users.role })
      .from(table_users)
      .where(and(eq(table_users.id, data.user.id), notDeleted(table_users)))
      .limit(1),
  );

  const role = rows?.[0]?.role;

  if (profileErr || !role || !isUserRole(role)) {
    if (isAccessingProtectedPage)
      return NextResponse.redirect(new URL(paths.unauthorized, request.url));
    return response;
  }

  const homePath = homePathForRole(role);

  if (isAccessingLandingPage || isAccessingGuestOnlyAuthPage)
    return NextResponse.redirect(new URL(homePath, request.url));

  if (isAccessingAdmin && role !== UserRoles.Admin)
    return NextResponse.redirect(new URL(homePath, request.url));

  return response;
}

/**
 * Skip Next internals, API, and static files. If the URL already has a locale,
 * persist it on the cookie. Otherwise redirect to `/{preferredLocale}{path}`.
 */
async function useI18nMiddleware(request: NextRequest, response: NextResponse) {
  if (!I18N_PATHNAME_REGEXP.test(request.nextUrl.pathname)) return response;

  const { pathname } = request.nextUrl;
  const pathnameLocale = pathname.split('/')[1];

  if (pathnameLocale && isSupportedLocaleCode(pathnameLocale)) {
    response.cookies.set(LOCALE_COOKIE_KEY, pathnameLocale);
    return response;
  }

  const locale = getUserLocaleFromRequest(request);

  request.nextUrl.pathname = `/${locale}${pathname}`;

  const responseNew = NextResponse.redirect(request.nextUrl, {
    headers: response.headers,
  });

  responseNew.cookies.set(LOCALE_COOKIE_KEY, locale);

  return responseNew;
}

function pathnameWithoutLocale(pathname: string) {
  const maybeLocale = pathname.split('/')[1];

  if (!maybeLocale || !isSupportedLocaleCode(maybeLocale)) return pathname;

  const rest = pathname.slice(maybeLocale.length + 1);
  return rest || '/';
}
