import { injectable, inject } from 'inversify';
import { TYPES } from '@/src/types/container.types';
import type { IProductRepository } from '@/src/domain/product/product.repository';
import type { ProductCategory } from '@/src/domain/product/product.entity';

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    try {
      // Validate that the key is unique
      const existingCategories = await this.productRepository.getAllCategories();
      const keyExists = existingCategories.some(cat => cat.key === data.key);
      
      if (keyExists) {
        throw new Error(`Category with key '${data.key}' already exists`);
      }

      return await this.productRepository.createCategory(data);
    } catch (error) {
      console.error('Error in CreateCategoryUseCase:', error);
      throw error instanceof Error ? error : new Error('Failed to create category');
    }
  }
}

export type CreateCategoryData = Omit<ProductCategory, 'id'>;