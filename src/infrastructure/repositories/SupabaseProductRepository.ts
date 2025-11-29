import { injectable, inject } from 'inversify';
import { eq, ilike, and, or, gte, lte, desc, asc, count } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { IProductRepository } from '@/domain/product/product.repository';
import type { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductListOptions,
  ProductCategory,
  ProductImage,
} from '@/domain/product/product.entity';
import type { ISupabaseService } from '@/infrastructure/supabase/supabase.interface';
import { products, productCategories, productImages, productsMetadata } from '@/infrastructure/supabase/schema';
import { TYPES } from '@/types/container.types';

const STATUS_MAP = { active: 1, inactive: 2, discontinued: 3 };
const BADGE_MAP = { new: 1, sale: 2 };
const REVERSE_STATUS_MAP: Record<number, 'active' | 'inactive' | 'discontinued'> = { 1: 'active', 2: 'inactive', 3: 'discontinued' };
const REVERSE_BADGE_MAP: Record<number, 'new' | 'sale'> = { 1: 'new', 2: 'sale' };

// Type for grouped product data from joins
type ProductJoinResult = {
  product: typeof products.$inferSelect;
  category: typeof productCategories.$inferSelect | null;
  images: (typeof productImages.$inferSelect)[];
  metadata: typeof productsMetadata.$inferSelect | null;
};

/**
 * SupabaseProductRepository
 * Implements IProductRepository using Drizzle ORM with Supabase PostgreSQL
 */
@injectable()
export class SupabaseProductRepository implements IProductRepository {
  private db: PostgresJsDatabase<Record<string, unknown>>;

  constructor(
    @inject(TYPES.SupabaseService) private supabaseService: ISupabaseService
  ) {
    this.db = this.supabaseService.getDrizzleInstance();
  }

  async getAllProducts(options?: ProductListOptions): Promise<Product[]> {
    try {
      const filters = this.buildFilterConditions(options?.filters);
      
      const query = this.buildProductWithJoinsQuery();

      const withFilters = filters.length > 0 ? query.where(and(...filters)) : query;
      const withSort = options?.sort
        ? withFilters.orderBy(
            options.sort.direction === 'desc'
              ? desc(this.getSortField(options.sort.field))
              : asc(this.getSortField(options.sort.field))
          )
        : withFilters;
      const withLimit = options?.limit ? withSort.limit(options.limit) : withSort;
      const withOffset = options?.offset ? withLimit.offset(options.offset) : withLimit;

      const rows = await withOffset;
      
      const productsMap = this.groupJoinResultsToProducts(rows);
      const productsArray = Array.from(productsMap.values());
      return productsArray.map((item) => this.mapRowToProduct(item));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const rows = await this.buildProductWithJoinsQuery().where(eq(products.id, id));

      if (rows.length === 0) return null;

      const productsMap = this.groupJoinResultsToProducts(rows);
      const productData = productsMap.get(id);
      return productData ? this.mapRowToProduct(productData) : null;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      throw new Error('Failed to fetch product');
    }
  }

  async getProductByCode(code: string): Promise<Product | null> {
    try {
      const rows = await this.buildProductWithJoinsQuery().where(eq(products.code, code));

      if (rows.length === 0) return null;

      const productId = rows[0].products.id;
      const productsMap = this.groupJoinResultsToProducts(rows);
      const productData = productsMap.get(productId);
      return productData ? this.mapRowToProduct(productData) : null;
    } catch (error) {
      console.error('Error fetching product by code:', error);
      throw new Error('Failed to fetch product');
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const [created] = await this.db.insert(products).values({
        code: data.code,
        name: data.name,
        description: data.description || null,
        price: data.price,
        stock: data.stock,
        categoryId: this.parseNumericId(data.categoryId),
        isStarred: data.isStarred ?? false,
        badge: data.badge ? BADGE_MAP[data.badge] : null,
        status: 1,
      }).returning();

      await this.upsertMetadata(created.id, data.metadata, data.tags);

      return this.getProductById(created.id) as Promise<Product>;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    try {
      await this.upsertMetadata(id, data.metadata, data.tags);
      await this.replaceImages(id, data.images);
      
      const updates: Record<string, number | string | boolean | null> = {};
      if (data.name !== undefined) updates.name = data.name;
      if (data.description !== undefined) updates.description = data.description || null;
      if (data.price !== undefined) updates.price = data.price;
      if (data.stock !== undefined) updates.stock = data.stock;
      if (data.categoryId !== undefined) updates.categoryId = this.parseNumericId(data.categoryId);
      if (data.isStarred !== undefined) updates.isStarred = data.isStarred;
      if (data.badge !== undefined) updates.badge = data.badge ? BADGE_MAP[data.badge] : null;
      if (data.status !== undefined) updates.status = STATUS_MAP[data.status];

      if (Object.keys(updates).length > 0) {
        const [updated] = await this.db.update(products).set(updates).where(eq(products.id, id)).returning();
        if (!updated) throw new Error('Product not found');
      }

      return this.getProductById(id) as Promise<Product>;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.db.delete(productImages).where(eq(productImages.productId, id));
      await this.db.delete(productsMetadata).where(eq(productsMetadata.productId, id));
      await this.db.delete(products).where(eq(products.id, id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // ========== CATEGORY OPERATIONS ==========

  async getAllCategories(): Promise<ProductCategory[]> {
    try {
      const rows = await this.db.select().from(productCategories);
      return rows.map((row) => this.mapRowToCategory(row));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  async getCategoryById(id: string): Promise<ProductCategory | null> {
    try {
      const rows = await this.db.select().from(productCategories).where(eq(productCategories.id, this.parseNumericId(id)));
      return rows.length > 0 ? this.mapRowToCategory(rows[0]) : null;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category');
    }
  }

  async createCategory(data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    try {
      const [created] = await this.db.insert(productCategories).values({
        name: data.name,
        key: data.key,
        description: data.description || null,
      }).returning();
      return this.mapRowToCategory(created);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(id: string, data: Partial<ProductCategory>): Promise<ProductCategory> {
    try {
      const updates: Record<string, string | null> = {};
      if (data.name !== undefined) updates.name = data.name;
      if (data.key !== undefined) updates.key = data.key;
      if (data.description !== undefined) updates.description = data.description || null;

      if (Object.keys(updates).length === 0) {
        const existing = await this.getCategoryById(id);
        if (!existing) throw new Error('Category not found');
        return existing;
      }

      const [updated] = await this.db.update(productCategories).set(updates).where(eq(productCategories.id, this.parseNumericId(id))).returning();
      if (!updated) throw new Error('Category not found');
      return this.mapRowToCategory(updated);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.db.delete(productCategories).where(eq(productCategories.id, this.parseNumericId(id)));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  async getProductCount(options?: ProductListOptions): Promise<number> {
    try {
      const filters = options?.filters ? this.buildFilterConditions(options.filters) : [];
      
      const baseQuery = this.db
        .select({ count: count().as('count') })
        .from(products);
      
      const result = filters.length > 0
        ? await baseQuery.where(and(...filters))
        : await baseQuery;
      
      return (result[0]?.count as number) ?? 0;
    } catch (error) {
      console.error('Error counting products:', error);
      throw new Error('Failed to count products');
    }
  }

  async isCodeUnique(code: string, excludeId?: string): Promise<boolean> {
    try {
      const rows = await this.db.select().from(products).where(eq(products.code, code));
      if (excludeId) return rows.every((row) => row.id !== excludeId);
      return rows.length === 0;
    } catch (error) {
      console.error('Error checking code uniqueness:', error);
      throw new Error('Failed to check code uniqueness');
    }
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    try {
      await this.db.update(products).set({ stock: quantity }).where(eq(products.id, id));
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock');
    }
  }

  async bulkUpdateStatus(ids: string[], status: Product['status']): Promise<void> {
    try {
      const statusCode = STATUS_MAP[status];
      const conditions = ids.map((id) => eq(products.id, id));
      await this.db.update(products).set({ status: statusCode }).where(or(...conditions));
    } catch (error) {
      console.error('Error bulk updating status:', error);
      throw new Error('Failed to bulk update status');
    }
  }

  private parseNumericId(value: string): number {
    return parseInt(value, 10);
  }

  private hasMetadata(metadata: Product['metadata']): boolean {
    if (!metadata) return false;
    return !!(
      metadata.weight ||
      metadata.materials?.length ||
      (metadata.dimensions?.length && metadata.dimensions.length > 0) ||
      (metadata.dimensions?.width && metadata.dimensions.width > 0) ||
      (metadata.dimensions?.height && metadata.dimensions.height > 0)
    );
  }

  private async upsertMetadata(productId: string, metadata: Product['metadata'] | undefined, tags: string[] = []): Promise<void> {
    if (!metadata || !this.hasMetadata(metadata)) {
      // No metadata to save - optionally delete if exists
      return;
    }

    const existing = await this.db.select().from(productsMetadata).where(eq(productsMetadata.productId, productId));
    const metaValues = this.buildMetadataValues(metadata, tags);

    if (existing.length > 0) {
      await this.db.update(productsMetadata).set(metaValues).where(eq(productsMetadata.productId, productId));
    } else {
      await this.db.insert(productsMetadata).values({ productId, ...metaValues });
    }
  }

  private async replaceImages(productId: string, images: Omit<ProductImage, 'id'>[] | undefined): Promise<void> {
    // Always delete existing images first
    await this.db.delete(productImages).where(eq(productImages.productId, productId));

    // Insert new images if provided and not empty
    if (images && images.length > 0) {
      await this.db.insert(productImages).values(this.buildImageValues(images, productId));
    }
  }

  private buildProductWithJoinsQuery() {
    return this.db
      .select()
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .leftJoin(productsMetadata, eq(products.id, productsMetadata.productId));
  }

  private groupJoinResultsToProducts(rows: {
    products: typeof products.$inferSelect;
    product_categories: typeof productCategories.$inferSelect | null;
    product_images: typeof productImages.$inferSelect | null;
    products_metadata: typeof productsMetadata.$inferSelect | null;
  }[]): Map<string, ProductJoinResult> {
    const productsMap = new Map<string, ProductJoinResult>();
    rows.forEach((row) => {
      const productId = row.products.id;
      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          product: row.products,
          category: row.product_categories,
          images: [],
          metadata: row.products_metadata,
        });
      }
      if (row.product_images != null && !productsMap.get(productId)!.images.some((img) => img.id === row.product_images!.id)) {
        productsMap.get(productId)!.images.push(row.product_images);
      }
    });
    return productsMap;
  }

  private buildMetadataValues(metadata: Product['metadata'], tags: string[] = []) {
    return {
      weight: metadata?.weight ? String(metadata.weight) : null,
      length: metadata?.dimensions?.length ? String(metadata.dimensions.length) : null,
      width: metadata?.dimensions?.width ? String(metadata.dimensions.width) : null,
      height: metadata?.dimensions?.height ? String(metadata.dimensions.height) : null,
      materials: metadata?.materials || [],
      tags: tags || [],
    };
  }

  private buildImageValues(images: Omit<ProductImage, 'id'>[], productId: string) {
    return images.map((img, i) => ({
      productId,
      url: img.url,
      alt: img.alt || null,
      order: img.order ?? i,
      isPrimary: img.isPrimary ?? i === 0,
    }));
  }

  private buildFilterConditions(filters: ProductListOptions['filters']) {
    const conditions: ReturnType<typeof eq>[] = [];
    if (!filters) return conditions;

    if (filters.search) {
      conditions.push(or(
        ilike(products.name, `%${filters.search}%`),
        ilike(products.description, `%${filters.search}%`)
      )!);
    }
    if (filters.category) {
      const catId = this.parseNumericId(filters.category);
      if (!isNaN(catId)) conditions.push(eq(products.categoryId, catId));
    }
    if (filters.status) {
      conditions.push(eq(products.status, STATUS_MAP[filters.status]));
    }
    if (filters.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice));
    }
    if (filters.new) conditions.push(eq(products.badge, 1));
    if (filters.sale) conditions.push(eq(products.badge, 2));
    if (filters.starred) conditions.push(eq(products.isStarred, true));

    return conditions;
  }

  private getSortField(field: string) {
    switch (field) {
      case 'name': return products.name;
      case 'price': return products.price;
      case 'stock': return products.stock;
      case 'createdAt': return products.createdAt;
      case 'updatedAt': return products.updatedAt;
      default: return products.createdAt;
    }
  }

  private mapRowToProduct(data: ProductJoinResult): Product {
    const category = data.category
      ? this.mapRowToCategory(data.category)
      : { id: String(data.product.categoryId), name: 'Unknown', key: 'jewelry' as const };

    const images: ProductImage[] = (data.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? undefined,
      order: img.order ?? 0,
      isPrimary: img.isPrimary ?? false,
    }));

    const metadata = data.metadata
      ? {
          weight: data.metadata.weight ? Number(data.metadata.weight) : undefined,
          dimensions: {
            length: data.metadata.length ? Number(data.metadata.length) : 0,
            width: data.metadata.width ? Number(data.metadata.width) : 0,
            height: data.metadata.height ? Number(data.metadata.height) : 0,
          },
          materials: (data.metadata.materials ?? []) as string[],
        }
      : undefined;

    return {
      id: data.product.id,
      code: data.product.code,
      name: data.product.name,
      description: data.product.description ?? undefined,
      price: data.product.price,
      stock: data.product.stock,
      category,
      images,
      isStarred: data.product.isStarred ?? false,
      badge: data.product.badge ? REVERSE_BADGE_MAP[data.product.badge] : null,
      status: REVERSE_STATUS_MAP[data.product.status ?? 1],
      tags: [],
      createdAt: data.product.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: data.product.updatedAt?.toISOString() ?? new Date().toISOString(),
      metadata,
    };
  }

  private mapRowToCategory(row: typeof productCategories.$inferSelect): ProductCategory {
    return {
      id: String(row.id),
      name: row.name,
      key: row.key as ProductCategory['key'],
      description: row.description ?? undefined,
    };
  }
}
