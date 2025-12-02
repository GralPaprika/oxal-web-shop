import { injectable, inject } from 'inversify';
import type { IProductRepository } from '@/domain/product/product.repository';
import { TYPES } from '@/types/container.types';

export interface ValidationResult {
  canStar: boolean;
  currentStarredCount: number;
  maxAllowed: number;
  message?: string;
}

@injectable()
export class ValidateCanStarProductUseCase {
  private readonly MAX_STARRED_PRODUCTS = 4;

  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  private checkStarLimit(currentStarredCount: number): ValidationResult | null {
    if (currentStarredCount >= this.MAX_STARRED_PRODUCTS) {
      return {
        canStar: false,
        currentStarredCount,
        maxAllowed: this.MAX_STARRED_PRODUCTS,
        message: `Cannot star more than ${this.MAX_STARRED_PRODUCTS} products. Current starred: ${currentStarredCount}`
      };
    }
    return null;
  }

  async execute(productId: string): Promise<ValidationResult> {
    if (!productId) {
      const allProducts = await this.productRepository.getAllProducts();
      const starredCount = allProducts.filter(p => p.isStarred).length;

      const limitCheckResult = this.checkStarLimit(starredCount);
      if (limitCheckResult) {
        return limitCheckResult;
      }

      return {
        canStar: true,
        currentStarredCount: starredCount,
        maxAllowed: this.MAX_STARRED_PRODUCTS
      };
    }

    const product = await this.productRepository.getProductById(productId);
    if (!product) {
      return {
        canStar: false,
        currentStarredCount: 0,
        maxAllowed: this.MAX_STARRED_PRODUCTS,
        message: 'Product not found'
      };
    }

    if (product.isStarred) {
      return {
        canStar: true,
        currentStarredCount: 0,
        maxAllowed: this.MAX_STARRED_PRODUCTS
      };
    }

    const allProducts = await this.productRepository.getAllProducts();
    const starredCount = allProducts.filter(p => p.isStarred).length;

    const limitCheckResult = this.checkStarLimit(starredCount);
    if (limitCheckResult) {
      return limitCheckResult;
    }

    return {
      canStar: true,
      currentStarredCount: starredCount,
      maxAllowed: this.MAX_STARRED_PRODUCTS
    };
  }
}
