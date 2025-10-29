import { injectable, inject } from 'inversify';
import { TYPES } from '@/types/container.types';
import type { IProductRepository } from '@/domain/product/product.repository';
import type { ProductCategory } from '@/domain/product/product.entity';

@injectable()
export class GetCategoriesUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(): Promise<ProductCategory[]> {
    try {
      return await this.productRepository.getAllCategories();
    } catch (error) {
      console.error('Error in GetCategoriesUseCase:', error);
      throw new Error('Failed to fetch categories');
    }
  }
}