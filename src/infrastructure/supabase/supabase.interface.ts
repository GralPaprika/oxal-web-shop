import type { DrizzleConfig } from 'drizzle-orm';

/**
 * Supabase Service Interface
 * Abstracts the database connection layer
 * Allows for easy testing and future changes
 */
export interface ISupabaseService {
  /**
   * Get the Drizzle database instance
   */
  getDrizzleInstance(): DrizzleConfig;

  /**
   * Get the raw PostgreSQL client
   */
  getClient(): ReturnType<typeof import('postgres')>;

  /**
   * Test database connection
   */
  testConnection(): Promise<boolean>;

  /**
   * Close database connection
   */
  close(): Promise<void>;
}
