import { injectable, inject } from 'inversify';
import type { IProductRepository } from '@/domain/product/product.repository';
import type { Product, ProductListOptions } from '@/domain/product/product.entity';
import { TYPES } from '@/types/container.types';

@injectable()
export class GetAllProductsUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(options?: ProductListOptions): Promise<Product[]> {
    return await this.productRepository.getAllProducts(options);
  }
}

@injectable()
export class GetProductByIdUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<Product | null> {
    if (!id) {
      throw new Error('Product ID is required');
    }
    return await this.productRepository.getProductById(id);
  }
}

@injectable()
export class GetProductByCodeUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(code: string): Promise<Product | null> {
    if (!code) {
      throw new Error('Product code is required');
    }
    return await this.productRepository.getProductByCode(code);
  }
}

@injectable()
export class GetProductCountUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(options?: ProductListOptions): Promise<number> {
    return await this.productRepository.getProductCount(options);
  }
}