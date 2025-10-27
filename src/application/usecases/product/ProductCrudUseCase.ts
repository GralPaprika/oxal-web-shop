import { injectable, inject } from 'inversify';
import type { IProductRepository } from '@/domain/product/product.repository';
import type { Product, CreateProductData, UpdateProductData } from '@/domain/product/product.entity';
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

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Product ID is required');
    }

    // Check if product exists
    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await this.productRepository.deleteProduct(id);
  }
}