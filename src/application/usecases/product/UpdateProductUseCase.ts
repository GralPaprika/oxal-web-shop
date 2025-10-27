import { injectable, inject } from 'inversify';
import type { IProductRepository } from '@/domain/product/product.repository';
import type { Product, UpdateProductData } from '@/domain/product/product.entity';
import { TYPES } from '@/types/container.types';

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(id: string, data: UpdateProductData): Promise<Product> {
    if (!id) {
      throw new Error('Product ID is required');
    }

    // Validate price if provided
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    // Validate stock if provided
    if (data.stock !== undefined && data.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    // Check if product exists
    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return await this.productRepository.updateProduct(id, data);
  }
}