import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from './src/config/auth.config';

export function proxy(request: NextRequest) {
  // Check if the request is for an admin route (except login)
  if (request.nextUrl.pathname.startsWith(AUTH_CONFIG.ROUTES.ADMIN_BASE) && 
      !request.nextUrl.pathname.startsWith(AUTH_CONFIG.ROUTES.LOGIN)) {
    // Check for authentication token in cookies
    const authToken = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME);
    
    if (!authToken) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL(AUTH_CONFIG.ROUTES.LOGIN, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};