/**
 * Drizzle ORM Schema
 * Central place for all database table definitions
 * Ensures consistency and maintainability
 */

export { users } from './users.table';
export { products } from './products.table';
export { productsMetadata } from './products-metadata.table';
export { productImages } from './product-images.table';
export { categories } from './categories.table';
export { sessions } from './sessions.table';

import { users } from './users.table';
import { products } from './products.table';
import { productsMetadata } from './products-metadata.table';
import { productImages } from './product-images.table';
import { categories } from './categories.table';
import { sessions } from './sessions.table';

/**
 * Schema mapping
 * Maps collection names to Drizzle table schemas
 * Used by SupabaseDatabase adapter to dynamically resolve tables
 */
export const schemaMap = {
  users,
  products,
  productsMetadata,
  productImages,
  categories,
  sessions,
} as const;

export type Tables = typeof schemaMap;

export default schemaMap;
