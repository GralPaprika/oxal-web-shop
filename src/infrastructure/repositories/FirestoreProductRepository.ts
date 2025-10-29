import { injectable, inject } from 'inversify';
import type { IDatabase } from '@/database/database.interface';
import type { IProductRepository } from '@/domain/product/product.repository';
import type { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductListOptions,
  ProductCategory 
} from '@/domain/product/product.entity';
import { TYPES } from '@/types/container.types';

@injectable()
export class FirestoreProductRepository implements IProductRepository {
  private readonly PRODUCTS_COLLECTION = 'products';
  private readonly CATEGORIES_COLLECTION = 'product_categories';

  constructor(
    @inject(TYPES.Database) private database: IDatabase
  ) {}

  async getAllProducts(options?: ProductListOptions): Promise<Product[]> {
    try {
      let products: Product[];
      
      // Use paginated query if limit/offset are provided
      if (options?.limit || options?.offset) {
        const offset = options.offset || 0;
        const limit = options.limit || 1000; // Default large limit if not specified
        products = await this.database.getAllPaginated<Product>(
          this.PRODUCTS_COLLECTION,
          limit,
          offset
        );
      } else {
        products = await this.database.getAll<Product>(this.PRODUCTS_COLLECTION);
      }
      
      // Apply filters if provided
      if (options?.filters) {
        products = this.applyFilters(products, options.filters);
      }
      
      // Apply sorting if provided
      if (options?.sort) {
        products = this.applySorting(products, options.sort);
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await this.database.getById<Product>(this.PRODUCTS_COLLECTION, id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error('Failed to fetch product');
    }
  }

  async getProductByCode(code: string): Promise<Product | null> {
    try {
      const products = await this.database.getAll<Product>(this.PRODUCTS_COLLECTION);
      return products.find(product => product.code === code) || null;
    } catch (error) {
      console.error(`Error fetching product by code ${code}:`, error);
      throw new Error('Failed to fetch product');
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      // Get the category to embed it in the product
      const category = await this.getCategoryById(data.categoryId);
      if (!category) {
        throw new Error(`Category with id ${data.categoryId} not found`);
      }

      const now = new Date().toISOString();
      const productData = {
        code: data.code,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category,
        images: data.images?.map((img, index) => ({
          ...img,
          id: `img_${Date.now()}_${index}`,
        })) || [],
        status: 'active' as const,
        tags: data.tags || [],
        metadata: data.metadata,
        isStarred: data.isStarred || false,
        createdAt: now,
        updatedAt: now,
      };
      
      const id = await this.database.create<Product>(this.PRODUCTS_COLLECTION, productData);
      
      const createdProduct = await this.getProductById(id);
      if (!createdProduct) {
        throw new Error('Failed to retrieve created product');
      }
      
      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      await this.database.update(this.PRODUCTS_COLLECTION, id, updateData);
      
      const updatedProduct = await this.getProductById(id);
      if (!updatedProduct) {
        throw new Error('Failed to retrieve updated product');
      }
      
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.database.delete(this.PRODUCTS_COLLECTION, id);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw new Error('Failed to delete product');
    }
  }

  async getAllCategories(): Promise<ProductCategory[]> {
    try {
      return await this.database.getAll<ProductCategory>(this.CATEGORIES_COLLECTION);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  async getCategoryById(id: string): Promise<ProductCategory | null> {
    try {
      return await this.database.getById<ProductCategory>(this.CATEGORIES_COLLECTION, id);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw new Error('Failed to fetch category');
    }
  }

  async createCategory(data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    try {
      const id = await this.database.create<ProductCategory>(this.CATEGORIES_COLLECTION, data);
      return { id, ...data };
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(id: string, data: Partial<ProductCategory>): Promise<ProductCategory> {
    try {
      await this.database.update<ProductCategory>(this.CATEGORIES_COLLECTION, id, data);
      const updatedCategory = await this.database.getById<ProductCategory>(this.CATEGORIES_COLLECTION, id);
      if (!updatedCategory) {
        throw new Error('Category not found after update');
      }
      return updatedCategory;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw new Error('Failed to update category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.database.delete(this.CATEGORIES_COLLECTION, id);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw new Error('Failed to delete category');
    }
  }

  async getProductCount(options?: ProductListOptions): Promise<number> {
    try {
      const products = await this.getFilteredProducts(options);
      return products.length;
    } catch (error) {
      console.error('Error counting products:', error);
      throw new Error('Failed to count products');
    }
  }

  async isCodeUnique(code: string, excludeId?: string): Promise<boolean> {
    try {
      const products = await this.getFilteredProducts();
      const existingProduct = products.find((product: Product) => 
        product.code === code && product.id !== excludeId
      );
      return !existingProduct;
    } catch (error) {
      console.error(`Error checking code uniqueness for ${code}:`, error);
      throw new Error('Failed to check code uniqueness');
    }
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    try {
      const product = await this.getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      
      const newStock = Math.max(0, product.stock + quantity);
      await this.updateProduct(id, { stock: newStock });
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      throw new Error('Failed to update stock');
    }
  }

  async bulkUpdateStatus(ids: string[], status: Product['status']): Promise<void> {
    try {
      const updatePromises = ids.map(id => 
        this.updateProduct(id, { status })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error bulk updating product status:', error);
      throw new Error('Failed to bulk update product status');
    }
  }

  private applyFilters(products: Product[], filters: NonNullable<ProductListOptions['filters']>): Product[] {
    return products.filter(product => {
      if (filters.category && product.category.id !== filters.category) {
        return false;
      }
      
      if (filters.status && product.status !== filters.status) {
        return false;
      }
      
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }
      
      if (filters.inStock !== undefined) {
        const inStock = product.stock > 0;
        if (filters.inStock !== inStock) {
          return false;
        }
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          product.name,
          product.code,
          product.description,
          product.category.name,
          ...(product.tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  }

  private applySorting(products: Product[], sort: NonNullable<ProductListOptions['sort']>): Product[] {
    return products.sort((a, b) => {
      let aValue: string | number = a[sort.field];
      let bValue: string | number = b[sort.field];
      
      // Handle special cases for sorting
      if (sort.field === 'name' && typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sort.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Helper method to fetch and filter products
   * Consolidates the fetch-all-then-filter pattern used by multiple methods
   */
  private async getFilteredProducts(options?: ProductListOptions): Promise<Product[]> {
    let products = await this.database.getAll<Product>(this.PRODUCTS_COLLECTION);
    
    if (options?.filters) {
      products = this.applyFilters(products, options.filters);
    }
    
    if (options?.sort) {
      products = this.applySorting(products, options.sort);
    }
    
    return products;
  }
}