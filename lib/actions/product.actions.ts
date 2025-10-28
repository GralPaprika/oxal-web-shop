'use server';

import { container } from '@/container/container.config';
import { GetAllProductsUseCase, GetProductByIdUseCase, GetProductCountUseCase } from '@/application/usecases/product/GetProductsUseCase';
import { CreateProductUseCase } from '@/application/usecases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@/application/usecases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@/application/usecases/product/DeleteProductUseCase';
import { GetCategoriesUseCase } from '@/application/usecases/product/GetCategoriesUseCase';
import { TYPES } from '@/types/container.types';
import type { Product, ProductListOptions, CreateProductData, UpdateProductData, ProductCategory } from '@/domain/product/product.entity';
import type { User } from '@/domain/user/user.entity';
import { checkAuthStatus, getCurrentUser } from '@/lib/auth';

async function verifyAdminAccess(): Promise<{ success: boolean; error?: string; currentUser?: User }> {
  try {
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'Unauthorized: Authentication required'
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized: Admin privileges required'
      };
    }

    return {
      success: true,
      currentUser
    };
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return {
      success: false,
      error: 'Authentication verification failed'
    };
  }
}

function withAdminAuthOnly<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
) {
  return async (...args: TArgs): Promise<TReturn | { success: false; error: string }> => {
    const authResult = await verifyAdminAccess();
    if (!authResult.success) {
      return { success: false, error: authResult.error! } as TReturn;
    }

    try {
      return await fn(...args);
    } catch (error) {
      console.error('Product action error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      } as TReturn;
    }
  };
}

// GET PRODUCTS
export const getAllProducts = withAdminAuthOnly(async (options?: ProductListOptions): Promise<{ success: boolean; products?: Product[]; error?: string }> => {
  const getAllProductsUseCase = container.get<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase);
  const products = await getAllProductsUseCase.execute(options);
  return { success: true, products };
});

export const getProductById = withAdminAuthOnly(async (id: string): Promise<{ success: boolean; product?: Product; error?: string }> => {
  const getProductByIdUseCase = container.get<GetProductByIdUseCase>(TYPES.GetProductByIdUseCase);
  const product = await getProductByIdUseCase.execute(id);
  
  if (!product) {
    return { success: false, error: 'Product not found' };
  }
  
  return { success: true, product };
});

export const getProductCount = withAdminAuthOnly(async (options?: ProductListOptions): Promise<{ success: boolean; count?: number; error?: string }> => {
  const getProductCountUseCase = container.get<GetProductCountUseCase>(TYPES.GetProductCountUseCase);
  const count = await getProductCountUseCase.execute(options);
  return { success: true, count };
});

// CREATE PRODUCT
export const createProduct = withAdminAuthOnly(async (productData: CreateProductData) => {
  const createProductUseCase = container.get<CreateProductUseCase>(TYPES.CreateProductUseCase);
  const product = await createProductUseCase.execute(productData);
  return { success: true, product };
});

// UPDATE PRODUCT
export const updateProduct = withAdminAuthOnly(async (productId: string, productData: UpdateProductData) => {
  const updateProductUseCase = container.get<UpdateProductUseCase>(TYPES.UpdateProductUseCase);
  const product = await updateProductUseCase.execute(productId, productData);
  return { success: true, product };
});

// DELETE PRODUCT
export const deleteProduct = withAdminAuthOnly(async (productId: string): Promise<{ success: boolean; error?: string }> => {
  const deleteProductUseCase = container.get<DeleteProductUseCase>(TYPES.DeleteProductUseCase);
  await deleteProductUseCase.execute(productId);
  return { success: true };
});

// UPDATE PRODUCT IMAGES
export const updateProductImages = withAdminAuthOnly(async (
  productId: string, 
  images: CreateProductData['images']
): Promise<{ success: boolean; product?: Product; error?: string }> => {
  const updateProductUseCase = container.get<UpdateProductUseCase>(TYPES.UpdateProductUseCase);
  const product = await updateProductUseCase.execute(productId, { images });
  return { success: true, product };
});

// GET ALL CATEGORIES
export async function getAllCategories(): Promise<{ success: boolean; categories?: ProductCategory[]; error?: string }> {
  try {
    const getCategoriesUseCase = container.get<GetCategoriesUseCase>(TYPES.GetCategoriesUseCase);
    const categories = await getCategoriesUseCase.execute();
    return { success: true, categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch categories' 
    };
  }
}