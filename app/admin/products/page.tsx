import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { AUTH_CONFIG } from '@/config/auth.config';
import { UsersHeader } from '@/components/admin/users';
import { ProductsTableClient } from '@/components/admin/products';
import { getAllCategories } from '@/lib/actions/product.actions';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import type { ProductCategory } from '@/domain/product/product.entity';

async function AdminProductsPage({
  searchParams
}: {
  searchParams: { search?: string; category?: string; starred?: string; new?: string; sale?: string; lowStock?: string }
}) {
  const t = await getTranslations('admin.products');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');

  const params = await searchParams;
  const searchTerm = params.search || '';
  const selectedCategory = params.category || '';
  const selectedFilters = {
    starred: params.starred === 'true',
    new: params.new === 'true',
    sale: params.sale === 'true',
    lowStock: params.lowStock === 'true',
  };

  let categories: ProductCategory[] = [];
  try {
    const categoriesResult = await getAllCategories();
    categories = categoriesResult.success ? categoriesResult.data?.items || [] : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    categories = [];
  }

  const breadcrumbs = [
    { label: breadcrumbsT('dashboard'), href: AUTH_CONFIG.ROUTES.DASHBOARD },
    { label: breadcrumbsT('products'), current: true }
  ];

  const rightContent = (
    <Link href={AUTH_CONFIG.ROUTES.PRODUCTS_CREATE}>
      <Button className="flex items-center gap-2">
        <PlusIcon className="h-4 w-4" />
        {t('newProduct')}
      </Button>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background-secondary">
      <UsersHeader 
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        rightContent={rightContent}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {t('title')}
          </h2>
          <p className="text-text-secondary">
            {t('subtitle')}
          </p>
        </div>

        <ProductsTableClient
          initialCategories={categories}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedFilters={selectedFilters}
          translations={{
            searchPlaceholder: t('searchPlaceholder'),
            search: t('search'),
            filters: t('filters'),
            clearFilters: t('clearFilters'),
            allCategories: t('allCategories'),
            filterOptions: {
              starred: t('filterOptions.starred'),
              new: t('filterOptions.new'),
              sale: t('filterOptions.sale'),
              lowStock: t('filterOptions.lowStock'),
            },
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
              jewelry: categories.find(c => c.key === 'jewelry')?.name || '',
              clothing: categories.find(c => c.key === 'clothing')?.name || '',
              decoration: categories.find(c => c.key === 'decoration')?.name || '',
              accessories: categories.find(c => c.key === 'accessories')?.name || '',
            },
            empty: {
              title: t('empty.title'),
              subtitle: t('empty.subtitle'),
            },
            deleteDialog: {
              title: t('deleteDialog.title'),
              message: t('deleteDialog.message'),
              confirmButton: t('deleteDialog.confirmButton'),
              cancelButton: t('deleteDialog.cancelButton'),
              deleting: t('deleteDialog.deleting'),
              success: t('deleteDialog.success'),
              error: t('deleteDialog.error'),
            },
            notifications: {
              loadError: t('notifications.loadError'),
              loadErrorMessage: t('notifications.loadErrorMessage'),
              limitReached: t('notifications.limitReached'),
              limitReachedMessage: t('notifications.limitReachedMessage'),
              updateError: t('notifications.updateError'),
              updateErrorMessage: t('notifications.updateErrorMessage'),
            },
            pagination: {
              showing: t('pagination.showing'),
              of: t('pagination.of'),
              products: t('pagination.products'),
              previous: t('pagination.previous'),
              next: t('pagination.next'),
            },
          }}
        />
      </div>
    </div>
  );
}

export default AdminProductsPage;