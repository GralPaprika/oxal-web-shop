import { getTranslations } from 'next-intl/server';
import { AUTH_CONFIG } from '@/config/auth.config';
import { UsersHeader } from '@/src/components/admin/UsersHeader';
import { CreateProductForm } from '@/src/components/admin/CreateProductForm';

async function CreateProductPage() {
  const t = await getTranslations('admin.products');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  const breadcrumbs = [
    { label: breadcrumbsT('dashboard'), href: AUTH_CONFIG.ROUTES.DASHBOARD },
    { label: breadcrumbsT('products'), href: AUTH_CONFIG.ROUTES.PRODUCTS },
    { label: t('create.title'), current: true }
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <UsersHeader 
        breadcrumbs={breadcrumbs}
        showBackButton={true}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {t('create.title')}
          </h2>
          <p className="text-text-secondary">
            {t('create.subtitle')}
          </p>
        </div>

        {/* Create Product Form */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <CreateProductForm />
        </div>
      </div>
    </div>
  );
}

export default CreateProductPage;