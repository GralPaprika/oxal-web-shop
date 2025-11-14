import { pgTable, text, timestamp, varchar, integer, boolean, jsonb, uuid, decimal, smallint } from 'drizzle-orm/pg-core';

/**
 * Drizzle ORM Schema
 * Defines all database tables for the Oxal project
 * 
 * Tables:
 * - users: User accounts and authentication
 * - products: Product catalog (core product data)
 * - products_metadata: Product metadata (weight, dimensions, materials)
 * - product_images: Product images with ordering
 * - categories: Product categories
 * - sessions: User sessions for authentication
 */

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('cashier'),
  status: smallint('status').default(1), // 1 = active, 2 = inactive, 3 = suspended
  emailVerified: boolean('email_verified').default(false),
  photoURL: varchar('photo_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  metadata: jsonb('metadata').default({}),
});

// Products table (core product data)
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

// Products Metadata table (separate for normalization)
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

// Product Images table (for detailed image management)
export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  alt: text('alt'),
  order: integer('order').default(0),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Sessions table (for authentication)
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

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
