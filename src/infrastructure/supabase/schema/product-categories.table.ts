import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Product Categories table
 * Stores product categories
 */
export const productCategories = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  key: varchar('key', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
