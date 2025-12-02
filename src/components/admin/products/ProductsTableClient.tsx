'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchForm } from './SearchForm';
import { ProductsTable } from './ProductsTable';
import { AUTH_CONFIG } from '@/config/auth.config';
import type { ProductCategory, Product } from '@/domain/product/product.entity';

interface ProductsTableClientProps {
  initialCategories: ProductCategory[];
  searchTerm: string;
  selectedCategory: string;
  selectedFilters: {
    starred: boolean;
    new: boolean;
    sale: boolean;
    lowStock: boolean;
  };
  translations: {
    searchPlaceholder: string;
    search: string;
    filters: string;
    clearFilters: string;
    allCategories: string;
    filterOptions: {
      starred: string;
      new: string;
      sale: string;
      lowStock: string;
    };
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
    notifications: {
      loadError: string;
      loadErrorMessage: string;
      limitReached: string;
      limitReachedMessage: string;
      updateError: string;
      updateErrorMessage: string;
    };
    pagination: {
      showing: string;
      of: string;
      products: string;
      previous: string;
      next: string;
    };
  };
}

export function ProductsTableClient({
  initialCategories,
  searchTerm: initialSearchTerm,
  selectedCategory: initialSelectedCategory,
  selectedFilters: initialSelectedFilters,
  translations
}: ProductsTableClientProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const [selectedFilters, setSelectedFilters] = useState(initialSelectedFilters);
  const router = useRouter();

  const handleSearch = (newSearchTerm: string, newCategory: string, newFilters: { starred: boolean; new: boolean; sale: boolean; lowStock: boolean }) => {
    setSearchTerm(newSearchTerm);
    setSelectedCategory(newCategory);
    setSelectedFilters(newFilters);
  };

  const handleEditProduct = (product: Product) => {
    router.push(`${AUTH_CONFIG.ROUTES.PRODUCTS_EDIT}?id=${product.id}`);
  };

  return (
    <>
      {/* Filters and Search */}
      <SearchForm
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedFilters={selectedFilters}
        categories={initialCategories}
        onSearch={handleSearch}
        translations={{
          searchPlaceholder: translations.searchPlaceholder,
          search: translations.search,
          filters: translations.filters,
          clearFilters: translations.clearFilters || 'Clear Filters',
          allCategories: translations.allCategories,
          filterOptions: translations.filterOptions,
        }}
      />

      {/* Products Table with Pagination */}
      <ProductsTable
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedFilters={selectedFilters}
        showPagination={true}
        translations={{
          table: translations.table,
          stockStatus: translations.stockStatus,
          units: translations.units,
          categories: translations.categories,
          empty: translations.empty,
          deleteDialog: translations.deleteDialog,
          notifications: translations.notifications,
        }}
        paginationTranslations={translations.pagination}
        onEditProduct={handleEditProduct}
      />

    </>
  );
}