import { pgTable, varchar, text, integer, boolean, jsonb, uuid, timestamp, smallint } from 'drizzle-orm/pg-core';

/**
 * Products table
 * Stores core product information and metadata
 */
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  isStarred: boolean('is_starred').default(false),
  badge: smallint('badge'), // 1 = new, 2 = sale, null = no badge
  status: smallint('status').default(1), // 1 = active, 2 = inactive, 3 = discontinued
  tags: jsonb('tags').default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
