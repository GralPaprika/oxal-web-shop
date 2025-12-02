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
import type { ApiSingleResponse, ApiListResponse, ApiPaginatedResponse, ApiResponse } from '@/lib/api-response';
import { ApiResponse as Response } from '@/lib/api-response';

export async function getAllProducts(options?: ProductListOptions): Promise<ApiListResponse<Product>> {
  const getAllProductsUseCase = container.get<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase);
  const products = await getAllProductsUseCase.execute(options);
  return Response.success({ items: products, total: products.length });
}

export async function getProductById(id: string): Promise<ApiSingleResponse<Product>> {
  const getProductByIdUseCase = container.get<GetProductByIdUseCase>(TYPES.GetProductByIdUseCase);
  const product = await getProductByIdUseCase.execute(id);
  
  if (!product) {
    return Response.error('Product not found');
  }
  
  return Response.success(product);
}

export async function getProductCount(options?: ProductListOptions): Promise<ApiResponse<number>> {
  const getProductCountUseCase = container.get<GetProductCountUseCase>(TYPES.GetProductCountUseCase);
  const count = await getProductCountUseCase.execute(options);
  return Response.success(count);
}

export async function createProduct(productData: CreateProductData): Promise<ApiSingleResponse<Product>> {
  const createProductUseCase = container.get<CreateProductUseCase>(TYPES.CreateProductUseCase);
  const product = await createProductUseCase.execute(productData);
  return Response.success(product);
}

export async function updateProduct(productId: string, productData: UpdateProductData): Promise<ApiSingleResponse<Product>> {
  const updateProductUseCase = container.get<UpdateProductUseCase>(TYPES.UpdateProductUseCase);
  const product = await updateProductUseCase.execute(productId, productData);
  return Response.success(product);
}

export async function deleteProduct(productId: string): Promise<ApiResponse> {
  const deleteProductUseCase = container.get<DeleteProductUseCase>(TYPES.DeleteProductUseCase);
  await deleteProductUseCase.execute(productId);
  return Response.success();
}

export async function getPaginatedProducts(
  pageNumber: number = 1,
  pageSize: number = 25,
  options?: ProductListOptions
): Promise<ApiPaginatedResponse<Product>> {
  const getAllProductsUseCase = container.get<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase);
  const getProductCountUseCase = container.get<GetProductCountUseCase>(TYPES.GetProductCountUseCase);
  
  const offset = (pageNumber - 1) * pageSize;
  
  const paginatedOptions: ProductListOptions = {
    ...options,
    limit: pageSize,
    offset: offset
  };
  
  const products = await getAllProductsUseCase.execute(paginatedOptions);
  const total = await getProductCountUseCase.execute(options);
  
  return Response.success({ items: products, total, page: pageNumber, pageSize });
}

export async function validateCanStarProduct(productId: string): Promise<ApiResponse<{ canStar: boolean; currentStarredCount: number; maxAllowed: number; message?: string }>> {
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
}

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