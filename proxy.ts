import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './src/infrastructure/auth/auth.middleware';

export function proxy(request: NextRequest) {
  // Run auth middleware for protected routes
  const authResponse = authMiddleware(request);
  
  // If middleware returns a response, use it (redirect or error)
  if (authResponse) {
    return authResponse;
  }

  // Otherwise continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};