import { getTranslations } from 'next-intl/server';
import { logoutAction } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  CubeIcon, 
  UsersIcon, 
  PhotoIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const adminModules = [
  {
    titleKey: 'modules.products.title',
    descriptionKey: 'modules.products.description',
    icon: CubeIcon,
    href: '/admin/products',
    statsKey: 'modules.products.stats',
    color: 'bg-amber-500'
  },
  {
    titleKey: 'modules.clients.title',
    descriptionKey: 'modules.clients.description',
    icon: UsersIcon,
    href: '/admin/clients',
    statsKey: 'modules.clients.stats',
    color: 'bg-blue-500'
  },
  {
    titleKey: 'modules.images.title',
    descriptionKey: 'modules.images.description',
    icon: PhotoIcon,
    href: '/admin/images',
    statsKey: 'modules.images.stats',
    color: 'bg-green-500'
  },
  {
    titleKey: 'modules.sales.title',
    descriptionKey: 'modules.sales.description',
    icon: ChartBarIcon,
    href: '/admin/sales',
    statsKey: 'modules.sales.stats',
    color: 'bg-purple-500'
  },
  {
    titleKey: 'modules.orders.title',
    descriptionKey: 'modules.orders.description',
    icon: ShoppingBagIcon,
    href: '/admin/orders',
    statsKey: 'modules.orders.stats',
    color: 'bg-red-500'
  },
  {
    titleKey: 'modules.settings.title',
    descriptionKey: 'modules.settings.description',
    icon: CogIcon,
    href: '/admin/settings',
    statsKey: '',
    color: 'bg-gray-500'
  },
];

export default async function AdminDashboard() {
  const t = await getTranslations('auth.dashboard');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  const breadcrumbs = [
    { label: breadcrumbsT('dashboard'), current: true }
  ];

  const rightContent = (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" className="text-sm">
        {t('logout')}
      </Button>
    </form>
  );
  
  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <AdminHeader 
        breadcrumbs={breadcrumbs}
        rightContent={rightContent}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {t('welcomeBack')}
          </h2>
          <p className="text-text-secondary">
            {t('subtitle')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100">
                <CubeIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-secondary">{t('stats.totalProducts')}</p>
                <p className="text-2xl font-bold text-text-primary">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-secondary">{t('stats.clients')}</p>
                <p className="text-2xl font-bold text-text-primary">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-secondary">{t('stats.monthlyOrders')}</p>
                <p className="text-2xl font-bold text-text-primary">89</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-secondary">{t('stats.sales')}</p>
                <p className="text-2xl font-bold text-text-primary">$12,450</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link
                key={module.titleKey}
                href={module.href}
                className="group bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-all duration-200 hover:border-amber-200"
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-amber-600 transition-colors">
                      {t(module.titleKey)}
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      {t(module.descriptionKey)}
                    </p>
                    {module.statsKey && (
                      <p className="text-amber-600 text-sm font-medium mt-2">
                        {t(module.statsKey)}
                      </p>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}