import { injectable } from 'inversify';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

/**
 * Supabase database service
 * Responsible for creating and managing the database connection
 * Follows Dependency Injection pattern - exported as singleton
 */
@injectable()
export class SupabaseService {
  private client: ReturnType<typeof postgres>;
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Create PostgreSQL client
    this.client = postgres(databaseUrl, {
      // Connection pool settings
      max: 10,
      // Prepare statements
      prepare: true,
      // Debug mode (set to false in production)
      debug: process.env.NODE_ENV === 'development',
    });

    // Initialize Drizzle ORM
    this.db = drizzle(this.client);
  }

  /**
   * Get the Drizzle database instance
   * Used by repositories to interact with the database
   */
  getDrizzleInstance() {
    return this.db;
  }

  /**
   * Get the raw PostgreSQL client
   * Used for raw SQL queries if needed
   */
  getClient() {
    return this.client;
  }

  /**
   * Test database connection
   * Useful for health checks
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.db.execute(sql`SELECT 1`);
      return result !== undefined;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Gracefully close database connection
   * Call this on application shutdown
   */
  async close(): Promise<void> {
    try {
      await this.client.end();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}
