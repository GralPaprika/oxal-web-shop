import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_CONFIG } from '@/src/config/auth.config';

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const sessionCookie = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    return sessionCookie;
  }

  return null;
}

function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(AUTH_CONFIG.ROUTES.ADMIN_BASE) ||
         pathname.startsWith(AUTH_CONFIG.ROUTES.API_ADMIN_BASE);
}

function isLoginRoute(pathname: string): boolean {
  return pathname === AUTH_CONFIG.ROUTES.LOGIN;
}

export function authMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return null;
  }

  if (isLoginRoute(pathname)) {
    return null;
  }

  const token = extractToken(request);

  if (!token) {
    const isApiRoute = pathname.startsWith(AUTH_CONFIG.ROUTES.API_ADMIN_BASE);

    if (isApiRoute) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication token required',
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL(AUTH_CONFIG.ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return null;
}
