import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { checkAuthStatus } from '@/lib/auth';
import { AUTH_CONFIG } from '@/config/auth.config';
import { AdminHeader } from '@/components/admin/AdminHeader';
import Image from 'next/image';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

// Mock data - in real app this would come from database
const mockProducts = [
  {
    id: 1,
    code: 'COL001',
    name: 'Collar Lunar Místico',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
    price: 89.99,
    stock: 12,
    description: 'Hermoso collar artesanal con piedras naturales',
    category: 'Joyería'
  },
  {
    id: 2,
    code: 'VEL002',
    name: 'Vela Aromática Lavanda',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',
    price: 24.99,
    stock: 25,
    description: 'Vela artesanal con aceites esenciales naturales',
    category: 'Decoración'
  },
  {
    id: 3,
    code: 'MAN003',
    name: 'Manta Boho Chic',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    price: 129.99,
    stock: 8,
    description: 'Manta tejida a mano con patrones bohemios',
    category: 'Ropa'
  },
  {
    id: 4,
    code: 'MAC004',
    name: 'Maceta Cerámica Artesanal',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    price: 45.99,
    stock: 15,
    description: 'Maceta de cerámica hecha a mano',
    category: 'Decoración'
  },
  {
    id: 5,
    code: 'BOL005',
    name: 'Bolso Artesanal Cuero',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    price: 199.99,
    stock: 3,
    description: 'Bolso de cuero genuino trabajado artesanalmente',
    category: 'Accesorios'
  },
];

export default async function AdminProducts() {
  const t = await getTranslations('admin.products');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  // Check authentication status - same as dashboard would have
  const isAuthenticated = await checkAuthStatus();
  if (!isAuthenticated) {
    redirect(AUTH_CONFIG.ROUTES.LOGIN);
  }

  const breadcrumbs = [
    { label: breadcrumbsT('dashboard'), href: '/admin/dashboard' },
    { label: breadcrumbsT('products'), current: true }
  ];

  const rightContent = (
    <Button className="flex items-center gap-2">
      <PlusIcon className="h-4 w-4" />
      {t('newProduct')}
    </Button>
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: t('stockStatus.outOfStock'), color: 'text-red-600 bg-red-50' };
    if (stock <= 5) return { text: t('stockStatus.lowStock'), color: 'text-orange-600 bg-orange-50' };
    return { text: t('stockStatus.inStock'), color: 'text-green-600 bg-green-50' };
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <AdminHeader 
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
                <option>Joyería</option>
                <option>Ropa</option>
                <option>Decoración</option>
                <option>Accesorios</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {mockProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <Image
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-text-primary">
                              {product.name}
                            </div>
                            <div className="text-sm text-text-secondary">
                              {product.category}
                            </div>
                            {product.description && (
                              <div className="text-xs text-text-muted mt-1 max-w-xs truncate">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-text-primary bg-neutral-100 px-2 py-1 rounded">
                          {product.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-text-primary">
                          ${product.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-text-primary">
                          {product.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center text-sm text-text-secondary">
            Mostrando 1-5 de 24 productos
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Anterior
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              2
            </button>
            <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}