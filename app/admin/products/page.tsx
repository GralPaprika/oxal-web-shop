import { getTranslations } from 'next-intl/server';
import { AUTH_CONFIG } from '@/config/auth.config';
import { UsersHeader } from '@/src/components/admin/UsersHeader';
import { ProductsTable } from '@/src/components/admin/ProductsTable';
import { getAllProducts } from '@/lib/actions/product.actions';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

async function AdminProductsPage() {
  const t = await getTranslations('admin.products');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  // Fetch real products from database
  const productsResult = await getAllProducts();
  const products = productsResult.success ? productsResult.products || [] : [];
  
  // No authentication check needed - handled by middleware

  const breadcrumbs = [
    { label: breadcrumbsT('dashboard'), href: AUTH_CONFIG.ROUTES.DASHBOARD },
    { label: breadcrumbsT('products'), current: true }
  ];

  const rightContent = (
    <Button className="flex items-center gap-2">
      <PlusIcon className="h-4 w-4" />
      {t('newProduct')}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <UsersHeader 
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        rightContent={rightContent}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {t('title')}
          </h2>
          <p className="text-text-secondary">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                <FunnelIcon className="h-4 w-4" />
                {t('filters')}
              </button>
              <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                <option>{t('allCategories')}</option>
                <option>{t('categories.jewelry')}</option>
                <option>{t('categories.clothing')}</option>
                <option>{t('categories.decoration')}</option>
                <option>{t('categories.accessories')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable
          products={products}
          translations={{
            table: {
              product: t('table.product'),
              code: t('table.code'),
              price: t('table.price'),
              stock: t('table.stock'),
              status: t('table.status'),
              actions: t('table.actions'),
            },
            stockStatus: {
              outOfStock: t('stockStatus.outOfStock'),
              lowStock: t('stockStatus.lowStock'),
              inStock: t('stockStatus.inStock'),
            },
            units: t('units'),
            categories: {
              jewelry: t('categories.jewelry'),
              clothing: t('categories.clothing'),
              decoration: t('categories.decoration'),
              accessories: t('categories.accessories'),
            },
          }}
        />

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center text-sm text-text-secondary">
              {t('pagination.showing')} 1-{products.length} {t('pagination.of')} {products.length} {t('pagination.products')}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
                {t('pagination.previous')}
              </button>
              <button className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
                {t('pagination.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the page directly - no auth wrapper needed (handled by middleware)
export default AdminProductsPage;