import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from './src/config/auth.config';

export function proxy(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith(AUTH_CONFIG.ROUTES.ADMIN_BASE)) {
    // Allow login page without authentication
    if (request.nextUrl.pathname === AUTH_CONFIG.ROUTES.LOGIN) {
      return NextResponse.next();
    }
    
    // Check for authentication token in cookies
    const authToken = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME);
    
    if (!authToken || !authToken.value) {
      // Redirect to login if not authenticated
      const loginUrl = new URL(AUTH_CONFIG.ROUTES.LOGIN, request.url);
      
      // Add the intended destination as a query parameter for post-login redirect
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      
      return NextResponse.redirect(loginUrl);
    }
    
    // Token exists - continue to the requested page
    return NextResponse.next();
  }

  // For non-admin routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};