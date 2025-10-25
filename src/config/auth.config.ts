// Authentication configuration constants
export const AUTH_CONFIG = {
  // Session cookie name - __Host- prefix requires secure: true, so we'll use different names for dev/prod
  SESSION_COOKIE_NAME: process.env.NODE_ENV === 'production' 
    ? '__Host-sl_ctx_97x' 
    : 'sl_ctx_97x',
  
  // Route constants
  ROUTES: {
    ADMIN_BASE: '/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    SETTINGS: '/admin/settings',
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