import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

/**
 * Product Images table
 * Manages product images with ordering and primary image designation
 */
export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  alt: text('alt'),
  order: integer('order').default(0),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
