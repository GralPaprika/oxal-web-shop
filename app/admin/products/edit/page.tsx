import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { AUTH_CONFIG } from '@/config/auth.config';
import { UsersHeader } from '@/components/admin/users';
import { EditProductForm } from '@/components/admin/products';
import { getProductById } from '@/lib/actions/product.actions';

interface EditProductPageProps {
  searchParams: { id?: string };
}

async function EditProductPage({ searchParams }: EditProductPageProps) {
  const t = await getTranslations('admin.products');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  const params = await searchParams;
  const productId = params.id;
  
  if (!productId) {
    redirect(AUTH_CONFIG.ROUTES.PRODUCTS);
  }
  
  const productResult = await getProductById(productId);
  
  if (!productResult.success || !productResult.data) {
    redirect(AUTH_CONFIG.ROUTES.PRODUCTS);
  }
  
  const product = productResult.data;
  
  const breadcrumbs = [
    { label: breadcrumbsT('dashboard'), href: AUTH_CONFIG.ROUTES.DASHBOARD },
    { label: breadcrumbsT('products'), href: AUTH_CONFIG.ROUTES.PRODUCTS },
    { label: t('edit.title'), current: true }
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      <UsersHeader 
        breadcrumbs={breadcrumbs}
        showBackButton={true}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {t('edit.title')}
          </h2>
          <p className="text-text-secondary">
            {t('edit.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <EditProductForm product={product} />
        </div>
      </div>
    </div>
  );
}

export default EditProductPage;