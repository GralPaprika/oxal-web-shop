import type { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductListOptions,
  ProductCategory 
} from './product.entity';

export interface IProductRepository {
  getAllProducts(options?: ProductListOptions): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductByCode(code: string): Promise<Product | null>;
  createProduct(data: CreateProductData): Promise<Product>;
  updateProduct(id: string, data: UpdateProductData): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  getAllCategories(): Promise<ProductCategory[]>;
  getCategoryById(id: string): Promise<ProductCategory | null>;
  createCategory(data: Omit<ProductCategory, 'id'>): Promise<ProductCategory>;
  updateCategory(id: string, data: Partial<ProductCategory>): Promise<ProductCategory>;
  deleteCategory(id: string): Promise<void>;
  
  getProductCount(options?: ProductListOptions): Promise<number>;
  isCodeUnique(code: string, excludeId?: string): Promise<boolean>;
  updateStock(id: string, quantity: number): Promise<void>;
  bulkUpdateStatus(ids: string[], status: Product['status']): Promise<void>;
}