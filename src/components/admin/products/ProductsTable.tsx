'use client';

import Image from 'next/image';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/domain/product/product.entity';

interface ProductsTableProps {
  products: Product[];
  translations: {
    table: {
      product: string;
      code: string;
      price: string;
      stock: string;
      status: string;
      actions: string;
    };
    stockStatus: {
      outOfStock: string;
      lowStock: string;
      inStock: string;
    };
    units: string;
    categories: {
      jewelry: string;
      clothing: string;
      decoration: string;
      accessories: string;
    };
    empty: {
      title: string;
      subtitle: string;
    };
  };
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export function ProductsTable({
  products,
  translations: t,
  onEditProduct,
  onDeleteProduct
}: ProductsTableProps) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: t.stockStatus.outOfStock, color: 'text-red-600 bg-red-50' };
    if (stock <= 5) return { text: t.stockStatus.lowStock, color: 'text-orange-600 bg-orange-50' };
    return { text: t.stockStatus.inStock, color: 'text-green-600 bg-green-50' };
  };

  const getCategoryName = (categoryKey: string) => {
    const key = categoryKey as keyof typeof t.categories;
    return t.categories[key] || categoryKey;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.table.product}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.table.code}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.table.price}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.table.stock}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.table.status}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
              
              return (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        {primaryImage ? (
                          <Image
                            className="h-12 w-12 rounded-lg object-cover"
                            src={primaryImage.url}
                            alt={primaryImage.alt || product.name}
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-neutral-200 flex items-center justify-center">
                            <span className="text-xs text-neutral-500">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">
                          {product.name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {getCategoryName(product.category.key)}
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
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-primary">
                      {product.stock} {t.units}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onEditProduct?.(product)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct?.(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
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
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-neutral-400 text-lg mb-2">{t.empty.title}</div>
          <div className="text-neutral-500 text-sm">{t.empty.subtitle}</div>
        </div>
      )}
    </div>
  );
}