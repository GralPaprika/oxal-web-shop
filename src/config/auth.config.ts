// Authentication configuration constants
export const AUTH_CONFIG = {
  // Obfuscated cookie name - looks like a generic system identifier
  SESSION_COOKIE_NAME: '__Host-sl_ctx_97x',
  
  // Route constants
  ROUTES: {
    ADMIN_BASE: '/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
  },
  
  // Cookie configuration
  COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 1 week in seconds
  
  // Security settings
  COOKIE_SETTINGS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  }
} as const;