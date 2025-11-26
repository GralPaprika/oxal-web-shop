/**
 * Auth Middleware
 * Server-side protection for admin routes
 * Validates Authorization header or session cookie
 * Single Responsibility: Verify authentication on server
 */

import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_CONFIG } from '@/src/config/auth.config';

/**
 * Extract and verify token from request
 * Returns token if valid, null otherwise
 */
function extractToken(request: NextRequest): string | null {
  // Try Authorization header first (client-side requests)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7); // Remove 'Bearer ' prefix
  }

  // Try session cookie (SSR fallback)
  const sessionCookie = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    return sessionCookie;
  }

  return null;
}

/**
 * Check if route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(AUTH_CONFIG.ROUTES.ADMIN_BASE) ||
         pathname.startsWith(AUTH_CONFIG.ROUTES.API_ADMIN_BASE);
}

/**
 * Check if route is login page (public)
 */
function isLoginRoute(pathname: string): boolean {
  return pathname === AUTH_CONFIG.ROUTES.LOGIN;
}

export function authMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!isProtectedRoute(pathname)) {
    return null; // Continue to next middleware
  }

  // Allow login page without authentication
  if (isLoginRoute(pathname)) {
    return null;
  }

  // Extract token from request
  const token = extractToken(request);

  // If no token, handle based on route type
  if (!token) {
    const isApiRoute = pathname.startsWith(AUTH_CONFIG.ROUTES.API_ADMIN_BASE);

    if (isApiRoute) {
      // API route: return 401
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication token required',
        },
        { status: 401 }
      );
    }

    // Page route: redirect to login
    const loginUrl = new URL(AUTH_CONFIG.ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - continue
  return null;
}
