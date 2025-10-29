'use server';

import { container } from '@/container/container.config';
import { GetAllProductsUseCase, GetProductByIdUseCase, GetProductCountUseCase } from '@/application/usecases/product/GetProductsUseCase';
import { CreateProductUseCase } from '@/application/usecases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@/application/usecases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@/application/usecases/product/DeleteProductUseCase';
import { GetCategoriesUseCase } from '@/application/usecases/product/GetCategoriesUseCase';
import { ValidateCanStarProductUseCase } from '@/application/usecases/product/ValidateCanStarProductUseCase';
import { TYPES } from '@/types/container.types';
import type { Product, ProductListOptions, CreateProductData, UpdateProductData, ProductCategory } from '@/domain/product/product.entity';
import { withAdminAuthOnly } from '@/lib/auth-wrapper';
import type { ApiSingleResponse, ApiListResponse, ApiPaginatedResponse, ApiResponse } from '@/lib/api-response';
import { ApiResponse as Response } from '@/lib/api-response';

// GET PRODUCTS
export const getAllProducts = withAdminAuthOnly(async (options?: ProductListOptions): Promise<ApiListResponse<Product>> => {
  const getAllProductsUseCase = container.get<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase);
  const products = await getAllProductsUseCase.execute(options);
  return Response.success({ items: products, total: products.length });
});

export const getProductById = withAdminAuthOnly(async (id: string): Promise<ApiSingleResponse<Product>> => {
  const getProductByIdUseCase = container.get<GetProductByIdUseCase>(TYPES.GetProductByIdUseCase);
  const product = await getProductByIdUseCase.execute(id);
  
  if (!product) {
    return Response.error('Product not found');
  }
  
  return Response.success(product);
});

export const getProductCount = withAdminAuthOnly(async (options?: ProductListOptions): Promise<ApiResponse<number>> => {
  const getProductCountUseCase = container.get<GetProductCountUseCase>(TYPES.GetProductCountUseCase);
  const count = await getProductCountUseCase.execute(options);
  return Response.success(count);
});

// CREATE PRODUCT
export const createProduct = withAdminAuthOnly(async (productData: CreateProductData): Promise<ApiSingleResponse<Product>> => {
  const createProductUseCase = container.get<CreateProductUseCase>(TYPES.CreateProductUseCase);
  const product = await createProductUseCase.execute(productData);
  return Response.success(product);
});

// UPDATE PRODUCT
export const updateProduct = withAdminAuthOnly(async (productId: string, productData: UpdateProductData): Promise<ApiSingleResponse<Product>> => {
  const updateProductUseCase = container.get<UpdateProductUseCase>(TYPES.UpdateProductUseCase);
  const product = await updateProductUseCase.execute(productId, productData);
  return Response.success(product);
});

// DELETE PRODUCT
export const deleteProduct = withAdminAuthOnly(async (productId: string): Promise<ApiResponse> => {
  const deleteProductUseCase = container.get<DeleteProductUseCase>(TYPES.DeleteProductUseCase);
  await deleteProductUseCase.execute(productId);
  return Response.success();
});

// UPDATE PRODUCT IMAGES
export const updateProductImages = withAdminAuthOnly(async (
  productId: string, 
  images: CreateProductData['images']
): Promise<ApiSingleResponse<Product>> => {
  const updateProductUseCase = container.get<UpdateProductUseCase>(TYPES.UpdateProductUseCase);
  const product = await updateProductUseCase.execute(productId, { images });
  return Response.success(product);
});

// GET PAGINATED PRODUCTS
export const getPaginatedProducts = withAdminAuthOnly(async (
  pageNumber: number = 1,
  pageSize: number = 25,
  options?: ProductListOptions
): Promise<ApiPaginatedResponse<Product>> => {
  const getAllProductsUseCase = container.get<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase);
  const getProductCountUseCase = container.get<GetProductCountUseCase>(TYPES.GetProductCountUseCase);
  
  // Calculate offset based on page number and page size
  const offset = (pageNumber - 1) * pageSize;
  
  // Fetch only the required page of products with server-side pagination
  const paginatedOptions: ProductListOptions = {
    ...options,
    limit: pageSize,
    offset: offset
  };
  
  const products = await getAllProductsUseCase.execute(paginatedOptions);
  const total = await getProductCountUseCase.execute(options);
  
  return Response.success({ items: products, total, page: pageNumber, pageSize });
});

// VALIDATE CAN STAR PRODUCT
export const validateCanStarProduct = withAdminAuthOnly(async (productId: string): Promise<ApiResponse<{ canStar: boolean; currentStarredCount: number; maxAllowed: number; message?: string }>> => {
  const validateCanStarUseCase = container.get<ValidateCanStarProductUseCase>(TYPES.ValidateCanStarProductUseCase);
  const validationResult = await validateCanStarUseCase.execute(productId);
  
  if (!validationResult.canStar) {
    return Response.error(validationResult.message || 'Cannot star product');
  }

  return Response.success({ 
    canStar: true,
    currentStarredCount: validationResult.currentStarredCount,
    maxAllowed: validationResult.maxAllowed
  });
});

// GET ALL CATEGORIES
export async function getAllCategories(): Promise<ApiListResponse<ProductCategory>> {
  try {
    const getCategoriesUseCase = container.get<GetCategoriesUseCase>(TYPES.GetCategoriesUseCase);
    const categories = await getCategoriesUseCase.execute();
    return Response.success({ items: categories, total: categories.length });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.error(
      error instanceof Error ? error.message : 'Failed to fetch categories'
    );
  }
}