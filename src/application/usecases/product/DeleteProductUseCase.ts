import { injectable, inject } from 'inversify';
import type { IProductRepository } from '@/domain/product/product.repository';
import { TYPES } from '@/types/container.types';

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Product ID is required');
    }

    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await this.productRepository.deleteProduct(id);
  }
}