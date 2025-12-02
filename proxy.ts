import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './src/infrastructure/auth/auth.middleware';

export function proxy(request: NextRequest) {
  const authResponse = authMiddleware(request);
  
  if (authResponse) {
    return authResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};