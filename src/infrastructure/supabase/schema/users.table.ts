import { pgTable, varchar, boolean, jsonb, uuid, timestamp, smallint } from 'drizzle-orm/pg-core';

/**
 * Users table
 * Stores user account information and authentication data
 */
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
