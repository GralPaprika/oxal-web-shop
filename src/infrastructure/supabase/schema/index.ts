/**
 * Drizzle ORM Schema
 * Central place for all database table definitions
 * Ensures consistency and maintainability
 */

export { products } from './products.table';
export { productsMetadata } from './products-metadata.table';
export { productImages } from './product-images.table';
export { productCategories } from './product-categories.table';

import { products } from './products.table';
import { productsMetadata } from './products-metadata.table';
import { productImages } from './product-images.table';
import { productCategories } from './product-categories.table';

/**
 * Schema mapping
 * Maps collection names to Drizzle table schemas
 * Used by SupabaseDatabase adapter to dynamically resolve tables
 */
export const schemaMap = {
  products,
  productsMetadata,
  productImages,
  productCategories,
} as const;

export type Tables = typeof schemaMap;

export default schemaMap;
