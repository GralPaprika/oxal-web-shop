import { useTranslations } from 'next-intl';

export function useAdminBreadcrumbs() {
  const t = useTranslations('admin.common.breadcrumbs');
  
  return {
    dashboard: {
      label: t('dashboard'),
      href: '/admin/dashboard'
    },
    products: {
      label: t('products'),
      href: '/admin/products'
    },
    clients: {
      label: t('clients'),
      href: '/admin/clients'
    },
    orders: {
      label: t('orders'),
      href: '/admin/orders'
    },
    images: {
      label: t('images'),
      href: '/admin/images'
    },
    settings: {
      label: t('settings'),
      href: '/admin/settings'
    }
  };
}