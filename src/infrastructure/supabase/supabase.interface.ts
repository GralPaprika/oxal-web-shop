import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

/**
 * Supabase Service Interface
 * Abstracts the database connection layer
 * Allows for easy testing and future changes
 */
export interface ISupabaseService {
  /**
   * Get the Drizzle database instance
   */
  getDrizzleInstance(): PostgresJsDatabase<Record<string, unknown>>;

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
