'use client';

import { useState, useEffect } from 'react';
import { SearchForm } from './SearchForm';
import { ProductsTableWrapper } from './ProductsTableWrapper';
import type { Product, ProductCategory } from '@/domain/product/product.entity';

interface ProductsTableClientProps {
  initialProducts: Product[];
  initialCategories: ProductCategory[];
  searchTerm: string;
  selectedCategory: string;
  translations: {
    searchPlaceholder: string;
    search: string;
    filters: string;
    allCategories: string;
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
  initialProducts,
  initialCategories,
  searchTerm: initialSearchTerm,
  selectedCategory: initialSelectedCategory,
  translations
}: ProductsTableClientProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (newSearchTerm: string, newCategory: string) => {
    setSearchTerm(newSearchTerm);
    setSelectedCategory(newCategory);
    setIsLoading(true);

    try {
      // Call the API endpoint
      const params = new URLSearchParams();
      if (newSearchTerm.trim()) params.set('search', newSearchTerm.trim());
      if (newCategory && newCategory !== '') params.set('category', newCategory);
      params.set('page', '1');
      params.set('pageSize', '10');

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data.items || []);
      } else {
        console.error('API error:', data.error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update products when search params change from URL
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setSelectedCategory(initialSelectedCategory);
  }, [initialSearchTerm, initialSelectedCategory]);

  return (
    <>
      {/* Filters and Search */}
      <SearchForm
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        categories={initialCategories}
        onSearch={handleSearch}
        translations={{
          searchPlaceholder: translations.searchPlaceholder,
          search: translations.search,
          filters: translations.filters,
          allCategories: translations.allCategories,
        }}
      />

      {/* Products Table with Pagination */}
      <ProductsTableWrapper
        products={products}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        showPagination={true}
        translations={{
          table: translations.table,
          stockStatus: translations.stockStatus,
          units: translations.units,
          categories: translations.categories,
          empty: translations.empty,
          deleteDialog: translations.deleteDialog,
        }}
        paginationTranslations={translations.pagination}
      />

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      )}
    </>
  );
}