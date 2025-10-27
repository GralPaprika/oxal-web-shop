import { injectable, inject } from 'inversify';
import type { IProductRepository } from '@/domain/product/product.repository';
import type { Product, CreateProductData } from '@/domain/product/product.entity';
import { TYPES } from '@/types/container.types';

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(data: CreateProductData): Promise<Product> {
    // Validate required fields
    if (!data.code) {
      throw new Error('Product code is required');
    }
    if (!data.name) {
      throw new Error('Product name is required');
    }
    if (data.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
    if (data.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    // Check if code is unique
    const isUnique = await this.productRepository.isCodeUnique(data.code);
    if (!isUnique) {
      throw new Error(`Product code '${data.code}' already exists`);
    }

    return await this.productRepository.createProduct(data);
  }
}