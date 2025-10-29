'use client';

import { useRouter } from 'next/navigation';
import { ProductsTable } from './ProductsTable';
import { AUTH_CONFIG } from '@/config/auth.config';
import type { Product } from '@/domain/product/product.entity';

interface ProductsTableWrapperProps {
  products: Product[];
  searchTerm?: string;
  selectedCategory?: string;
  showPagination?: boolean;
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
    deleteDialog: {
      title: string;
      message: string;
      confirmButton: string;
      cancelButton: string;
      deleting: string;
      success: string;
      error: string;
    };
  };
  paginationTranslations?: {
    showing: string;
    of: string;
    products: string;
    previous: string;
    next: string;
  };
}

export function ProductsTableWrapper({
  products,
  searchTerm,
  selectedCategory,
  showPagination,
  translations,
  paginationTranslations,
}: ProductsTableWrapperProps) {
  const router = useRouter();

  const handleEditProduct = (product: Product) => {
    router.push(`${AUTH_CONFIG.ROUTES.PRODUCTS_EDIT}?id=${product.id}`);
  };

  return (
    <ProductsTable
      products={products}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      showPagination={showPagination}
      translations={translations}
      paginationTranslations={paginationTranslations}
      onEditProduct={handleEditProduct}
    />
  );
}