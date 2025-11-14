import { pgTable, uuid, decimal, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * Products Metadata table
 * Stores additional product metadata like dimensions and materials
 * Separated from main products table for normalization
 */
export const productsMetadata = pgTable('products_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  length: decimal('length', { precision: 10, scale: 2 }),
  width: decimal('width', { precision: 10, scale: 2 }),
  height: decimal('height', { precision: 10, scale: 2 }),
  materials: jsonb('materials').default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
