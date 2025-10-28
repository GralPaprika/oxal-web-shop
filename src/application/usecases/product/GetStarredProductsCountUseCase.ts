import { injectable, inject } from 'inversify';
import type { IProductRepository } from '@/domain/product/product.repository';
import { TYPES } from '@/types/container.types';

@injectable()
export class GetStarredProductsCountUseCase {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(): Promise<number> {
    const allProducts = await this.productRepository.getAllProducts();
    return allProducts.filter(product => product.isStarred).length;
  }
}
