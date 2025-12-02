import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/container/container.config';
import { GetAllProductsUseCase, GetProductCountUseCase } from '@/application/usecases/product/GetProductsUseCase';
import { TYPES } from '@/types/container.types';
import type { ProductListOptions } from '@/domain/product/product.entity';
import { ApiResponse } from '@/lib/api-response';
import { parseQueryParams } from '@/lib/utils/queryParams';

const productQueryParamDefs = {
  page: { type: 'number' as const, defaultValue: 1, min: 1 },
  pageSize: { type: 'number' as const, defaultValue: 10, min: 1, max: 100 },
  search: { type: 'string' as const, required: false },
  category: { type: 'string' as const, required: false },
  status: { type: 'enum' as const, required: false, enumValues: ['active', 'inactive', 'discontinued'] as const },
  minPrice: { type: 'number' as const, required: false, min: 0 },
  maxPrice: { type: 'number' as const, required: false, min: 0 },
  inStock: { type: 'boolean' as const, required: false },
  starred: { type: 'boolean' as const, required: false },
  new: { type: 'boolean' as const, required: false },
  sale: { type: 'boolean' as const, required: false },
  lowStock: { type: 'boolean' as const, required: false },
  sortField: { type: 'enum' as const, required: false, enumValues: ['name', 'price', 'stock', 'createdAt', 'updatedAt'] as const, defaultValue: 'updatedAt' },
  sortOrder: { type: 'enum' as const, required: false, enumValues: ['asc', 'desc'] as const, defaultValue: 'desc' }
} as const;

export const GET = async (request: NextRequest) => {
  try {
    const paramResult = parseQueryParams(request, productQueryParamDefs);

    if (!paramResult.success) {
      return NextResponse.json(
        ApiResponse.error(`Invalid query parameters: ${paramResult.errors.join(', ')}`),
        { status: 400 }
      );
    }

    const { page, pageSize, search, category, status, minPrice, maxPrice, inStock, starred, new: isNew, sale, lowStock, sortField, sortOrder } = paramResult.data;

    const filters: Record<string, unknown> = {};
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (minPrice !== undefined) filters.minPrice = minPrice;
    if (maxPrice !== undefined) filters.maxPrice = maxPrice;
    if (inStock !== undefined) filters.inStock = inStock;
    if (starred !== undefined) filters.starred = starred;
    if (isNew !== undefined) filters.new = isNew;
    if (sale !== undefined) filters.sale = sale;
    if (lowStock !== undefined) filters.lowStock = lowStock;

    const options: ProductListOptions = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      sort: {
        field: sortField,
        direction: sortOrder
      }
    };

    const getAllProductsUseCase = container.get<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase);
    const getProductCountUseCase = container.get<GetProductCountUseCase>(TYPES.GetProductCountUseCase);

    const [products, total] = await Promise.all([
      getAllProductsUseCase.execute(options),
      getProductCountUseCase.execute(options.filters ? { filters: options.filters } : undefined)
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json(ApiResponse.success({
      items: products,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage,
      hasPreviousPage
    }));

  } catch (error) {
    console.error('Error in GET /api/admin/products:', error);
    return NextResponse.json(
      ApiResponse.error(error instanceof Error ? error.message : 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}