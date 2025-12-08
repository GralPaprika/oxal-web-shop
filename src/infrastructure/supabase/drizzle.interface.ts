import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface IDrizzleService {
  getDrizzleInstance(): PostgresJsDatabase<Record<string, unknown>>;

  getClient(): ReturnType<typeof import('postgres')>;

  testConnection(): Promise<boolean>;

  close(): Promise<void>;
}
