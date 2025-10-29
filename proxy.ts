import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from './src/config/auth.config';

export function proxy(request: NextRequest) {
  const isAdminPageRoute = request.nextUrl.pathname.startsWith(AUTH_CONFIG.ROUTES.ADMIN_BASE);
  const isAdminApiRoute = request.nextUrl.pathname.startsWith(AUTH_CONFIG.ROUTES.API_ADMIN_BASE);

  // Check if the request is for an admin route (page or API)
  if (isAdminPageRoute || isAdminApiRoute) {
    // Allow login page without authentication (only for page routes)
    if (isAdminPageRoute && request.nextUrl.pathname === AUTH_CONFIG.ROUTES.LOGIN) {
      return NextResponse.next();
    }

    // Check for authentication token in cookies
    const authToken = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME);

    if (!authToken || !authToken.value) {
      // For API routes, return 401 Unauthorized
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: 'Authentication required', message: 'Please log in to access this resource' },
          { status: 401 }
        );
      }

      // For page routes, redirect to login
      const loginUrl = new URL(AUTH_CONFIG.ROUTES.LOGIN, request.url);

      // Add the intended destination as a query parameter for post-login redirect
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);

      return NextResponse.redirect(loginUrl);
    }

    // Token exists - continue to the requested page/API
    return NextResponse.next();
  }

  // For non-admin routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};