import { useTranslations } from 'next-intl';
import { AUTH_CONFIG } from '@/config/auth.config';

export function useAdminBreadcrumbs() {
  const t = useTranslations('admin.common.breadcrumbs');
  
  return {
    dashboard: {
      label: t('dashboard'),
      href: AUTH_CONFIG.ROUTES.DASHBOARD
    },
    products: {
      label: t('products'),
      href: AUTH_CONFIG.ROUTES.PRODUCTS
    },
    clients: {
      label: t('clients'),
      href: AUTH_CONFIG.ROUTES.CLIENTS
    },
    orders: {
      label: t('orders'),
      href: AUTH_CONFIG.ROUTES.ORDERS
    },
    sales: {
      label: t('sales'),
      href: AUTH_CONFIG.ROUTES.SALES
    },
    images: {
      label: t('images'),
      href: AUTH_CONFIG.ROUTES.IMAGES
    },
    settings: {
      label: t('settings'),
      href: AUTH_CONFIG.ROUTES.SETTINGS
    }
  };
}