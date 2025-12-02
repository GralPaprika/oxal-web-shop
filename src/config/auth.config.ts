export const AUTH_CONFIG = {
  SESSION_COOKIE_NAME: process.env.NODE_ENV === 'production' 
    ? '__Host-sl_ctx_97x' 
    : 'sl_ctx_97x',
  
  ROUTES: {
    ADMIN_BASE: '/admin',
    API_ADMIN_BASE: '/api/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    PRODUCTS_CREATE: '/admin/products/create',
    PRODUCTS_EDIT: '/admin/products/edit',
    CLIENTS: '/admin/clients',
    ORDERS: '/admin/orders',
    IMAGES: '/admin/images',
    SALES: '/admin/sales',
    SETTINGS: '/admin/settings',
  },
  
  COOKIE_MAX_AGE_SECONDS: 60 * 60 * 24 * 7,
  
  COOKIE_SETTINGS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  }
} as const;