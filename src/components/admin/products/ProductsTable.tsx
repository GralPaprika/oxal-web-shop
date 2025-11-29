'use client';

import { useState, useEffect, useTransition, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { DeleteProductDialog } from './DeleteProductDialog';
import { updateProduct, validateCanStarProduct } from '@/lib/actions/product.actions';
import { NotificationContainer, useNotification } from '@/components/ui/NotificationContainer';
import { PRODUCT_CONFIG } from '@/config/product.config';
import type { Product } from '@/domain/product/product.entity';

interface ProductsTableProps {
  searchTerm?: string;
  selectedCategory?: string;
  selectedFilters?: {
    starred: boolean;
    new: boolean;
    sale: boolean;
    lowStock: boolean;
  };
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
  onEditProduct?: (product: Product) => void;
  onProductCountChange?: (count: number) => void;
  paginationTranslations?: {
    showing: string;
    of: string;
    products: string;
    previous: string;
    next: string;
  };
}

export function ProductsTable({
  searchTerm,
  selectedCategory,
  selectedFilters,
  showPagination,
  translations: t,
  paginationTranslations,
  onEditProduct,
  onProductCountChange
}: ProductsTableProps) {
  const translations = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>(() => {
    // Initialize with empty array - data will be loaded via API
    return [];
  });
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const { notifications, removeNotification, showError } = useNotification();
  const prevSearchRef = useRef<string | undefined>(searchTerm);
  const prevCategoryRef = useRef<string | undefined>(selectedCategory);
  const prevFiltersRef = useRef<{ starred: boolean; new: boolean; sale: boolean; lowStock: boolean } | undefined>(selectedFilters);

  // Cache for storing API responses
  const cacheRef = useRef<Map<string, { items: Product[]; total: number }>>(new Map());

  // Generate cache key
  const getCacheKey = (search: string | undefined, category: string | undefined, filters: { starred: boolean; new: boolean; sale: boolean; lowStock: boolean } | undefined, page: number, pageSize: number) => {
    const filterStr = filters ? `${filters.starred}|${filters.new}|${filters.sale}|${filters.lowStock}` : '||||';
    return `${search || ''}|${category || ''}|${filterStr}|${page}|${pageSize}`;
  };

  // Build query parameters for API
  const buildQueryParams = useCallback((page: number, size: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedFilters?.starred) params.set('starred', 'true');
    if (selectedFilters?.new) params.set('new', 'true');
    if (selectedFilters?.sale) params.set('sale', 'true');
    if (selectedFilters?.lowStock) params.set('lowStock', 'true');
    params.set('page', page.toString());
    params.set('pageSize', size.toString());
    return params;
  }, [searchTerm, selectedCategory, selectedFilters]);

  // Fetch products from API and update state
  const fetchAndSetProducts = useCallback((items: Product[], total: number) => {
    setPaginatedProducts(items);
    setTotalProducts(total);
    onProductCountChange?.(total);
  }, [onProductCountChange]);

  // Load paginated data when page or pageSize changes
  useEffect(() => {
    const searchChanged = prevSearchRef.current !== searchTerm;
    const categoryChanged = prevCategoryRef.current !== selectedCategory;
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(selectedFilters);

    // Update refs
    prevSearchRef.current = searchTerm;
    prevCategoryRef.current = selectedCategory;
    prevFiltersRef.current = selectedFilters;

    startTransition(async () => {
      // If search, category, or filters changed, start from page 1
      const pageToLoad = (searchChanged || categoryChanged || filtersChanged) ? 1 : currentPage;

      // Generate cache key
      const cacheKey = getCacheKey(searchTerm, selectedCategory, selectedFilters, pageToLoad, pageSize);

      // Check cache first
      const cachedData = cacheRef.current.get(cacheKey);
      if (cachedData) {
        // Use cached data
        fetchAndSetProducts(cachedData.items, cachedData.total);

        // If we loaded page 1 due to filter change, update currentPage state
        if (searchChanged || categoryChanged || filtersChanged) {
          setCurrentPage(1);
        }
        return;
      }

      // Cache miss - make API call
      const params = buildQueryParams(pageToLoad, pageSize);

      try {
        const response = await fetch(`/api/admin/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        if (data.success && data.data) {
          const items = data.data.items || [];
          const total = data.data.total || 0;

          // Cache the result
          cacheRef.current.set(cacheKey, {
            items,
            total
          });

          fetchAndSetProducts(items, total);
        } else {
          throw new Error(data.error || 'Failed to load products');
        }

        // If we loaded page 1 due to filter change, update currentPage state
        if (searchChanged || categoryChanged || filtersChanged) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        showError('Error', 'Failed to load products');
      }
    });
  }, [currentPage, pageSize, searchTerm, selectedCategory, selectedFilters, translations, onProductCountChange, showError, buildQueryParams, fetchAndSetProducts]);

  const handleDeleteProduct = (product: Product) => {
    setDeleteProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleProductDeleted = () => {
    // Refresh the paginated data after deletion
    startTransition(async () => {
      // Call the API endpoint
      const params = buildQueryParams(currentPage, pageSize);

      try {
        const response = await fetch(`/api/admin/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        if (data.success && data.data) {
          fetchAndSetProducts(data.data.items || [], data.data.total || 0);
        } else {
          throw new Error(data.error || 'Failed to load products');
        }
      } catch (error) {
        console.error('Error loading products:', error);
        showError('Error', 'Failed to load products');
      }
    });
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteProduct(null);
  };

  const handleToggleStar = async (product: Product) => {
    try {
      // Only validate if trying to star, not unstar
      if (!product.isStarred) {
        const validationResult = await validateCanStarProduct(product.id);
        
        if (!validationResult.success) {
          showError(
            translations('admin.products.notifications.limitReached'),
            translations('admin.products.notifications.limitReachedMessage')
          );
          return;
        }
      }

      const result = await updateProduct(product.id, {
        isStarred: !product.isStarred
      });
      
      if (result.success) {
        // Update the local paginated products array
        const updatedProducts = paginatedProducts.map(p => 
          p.id === product.id ? { ...p, isStarred: !p.isStarred } : p
        );
        setPaginatedProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      showError(
        translations('admin.products.notifications.updateError'),
        translations('admin.products.notifications.updateErrorMessage')
      );
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: t.stockStatus.outOfStock, color: 'text-red-600 bg-red-50' };
    if (stock <= PRODUCT_CONFIG.LOW_STOCK_THRESHOLD) return { text: t.stockStatus.lowStock, color: 'text-orange-600 bg-orange-50' };
    return { text: t.stockStatus.inStock, color: 'text-green-600 bg-green-50' };
  };

  const getCategoryName = (categoryKey: string) => {
    const key = categoryKey as keyof typeof t.categories;
    return t.categories[key] || categoryKey;
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
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
            {isPending ? (
              // Loading skeleton
              Array.from({ length: pageSize }, (_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-neutral-200 rounded-lg"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-neutral-200 rounded w-12"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-neutral-200 rounded w-8"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-neutral-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-neutral-200 rounded"></div>
                      <div className="h-8 w-8 bg-neutral-200 rounded"></div>
                      <div className="h-8 w-8 bg-neutral-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              paginatedProducts.map((product) => {
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
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-text-primary">
                              {product.name}
                            </div>
                            {product.isStarred && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                ⭐ Destacado
                              </span>
                            )}
                            {product.badge && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                product.badge === 'new' 
                                  ? 'bg-green-100 text-green-800' 
                                  : product.badge === 'sale'
                                  ? 'bg-red-100 text-red-800'
                                  : ''
                              }`}>
                                {product.badge === 'new' ? 'Nuevo' : product.badge === 'sale' ? 'Oferta' : product.badge}
                              </span>
                            )}
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
                        {/* Star Toggle Button */}
                        <button 
                          onClick={() => handleToggleStar(product)}
                          className="p-2 hover:bg-amber-50 rounded-lg transition-colors group"
                          title={product.isStarred ? "Quitar de destacados" : "Marcar como destacado"}
                        >
                          {product.isStarred ? (
                            <StarIconSolid className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <StarIcon className="h-4 w-4 text-gray-400 group-hover:text-yellow-400" />
                          )}
                        </button>
                        <button 
                          onClick={() => onEditProduct?.(product)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {totalProducts === 0 && !isPending && (
        <div className="text-center py-12">
          <div className="text-neutral-400 text-lg mb-2">{t.empty.title}</div>
          <div className="text-neutral-500 text-sm">{t.empty.subtitle}</div>
        </div>
      )}

      <DeleteProductDialog
        product={deleteProduct}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDeleted={handleProductDeleted}
        translations={t.deleteDialog}
      />

      {/* Pagination */}
      {showPagination && totalProducts > 0 && (
        <div className="border-t border-neutral-200 p-6 flex items-center justify-between">
          {/* Page Size Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">{paginationTranslations?.showing || 'Showing'}:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white hover:border-neutral-400 transition-colors"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-text-secondary">
              ({paginationTranslations?.of || 'of'} {totalProducts} {paginationTranslations?.products || 'products'})
            </span>
          </div>

          {/* Pagination Info and Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {startIndex + 1}-{endIndex} {paginationTranslations?.of || 'of'} {totalProducts}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              >
                ← {paginationTranslations?.previous || 'Previous'}
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-amber-600 text-white'
                        : 'border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              >
                {paginationTranslations?.next || 'Next'} →
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}