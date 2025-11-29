import { injectable, inject } from 'inversify';
import { eq, lt, lte, gt, gte, ne } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/postgres-js';
import type { IDatabase } from '@/infrastructure/firebase/database.interface';
import type { ISupabaseService } from '@/infrastructure/supabase/supabase.interface';
import { schemaMap } from '@/infrastructure/supabase/schema';
import { TYPES } from '@/types/container.types';

type DrizzleInstance = ReturnType<typeof drizzle>;

/**
 * SupabaseDatabase - Supabase implementation of IDatabase
 * 
 * Adapts Drizzle ORM operations to match the IDatabase interface
 * This allows seamless replacement of Firebase with Supabase
 * 
 * Architecture: Infrastructure layer
 * Pattern: Adapter Pattern + Dependency Injection
 */
@injectable()
export class SupabaseDatabase implements IDatabase {
  private db: DrizzleInstance;
  private schemas = schemaMap;

  constructor(@inject(TYPES.SupabaseService) private supabaseService: ISupabaseService) {
    this.db = this.supabaseService.getDrizzleInstance() as DrizzleInstance;
  }

  /**
   * Create a new document in the collection
   * Returns the created document ID
   */
  async create<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      // Get the table schema dynamically
      const table = this.getTable(collectionName);
      
      // Insert the data - UUID is generated automatically by database
      const result = await this.db.insert(table).values({
        ...data,
      }).returning({ id: table.id });

      if (result.length > 0 && result[0].id) {
        return String(result[0].id);
      }

      throw new Error('Failed to create document');
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw new Error(`Failed to create document in ${collectionName}`);
    }
  }

  /**
   * Get a single document by ID
   */
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const table = this.getTable(collectionName);
      
      const result = await this.db
        .select()
        .from(table)
        .where(eq(table.id, id))
        .limit(1);

      return result.length > 0 ? (result[0] as T) : null;
    } catch (error) {
      console.error(`Error fetching document from ${collectionName}:`, error);
      throw new Error(`Failed to fetch document from ${collectionName}`);
    }
  }

  /**
   * Get all documents from a collection
   */
  async getAll<T>(collectionName: string): Promise<T[]> {
    try {
      const table = this.getTable(collectionName);
      
      const result = await this.db
        .select()
        .from(table);

      return result as T[];
    } catch (error) {
      console.error(`Error fetching all documents from ${collectionName}:`, error);
      throw new Error(`Failed to fetch documents from ${collectionName}`);
    }
  }

  /**
   * Get paginated documents from a collection
   */
  async getAllPaginated<T>(
    collectionName: string,
    pageSize: number,
    pageOffset: number
  ): Promise<T[]> {
    try {
      const table = this.getTable(collectionName);
      
      const result = await this.db
        .select()
        .from(table)
        .limit(pageSize)
        .offset(pageOffset);

      return result as T[];
    } catch (error) {
      console.error(`Error fetching paginated documents from ${collectionName}:`, error);
      throw new Error(`Failed to fetch paginated documents from ${collectionName}`);
    }
  }

  /**
   * Update a document
   */
  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const table = this.getTable(collectionName);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        ...data,
        updatedAt: new Date(),
      };
      
      await this.db
        .update(table)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .set(updateData as any)
        .where(eq(table.id, id));
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw new Error(`Failed to update document in ${collectionName}`);
    }
  }

  /**
   * Delete a document
   */
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const table = this.getTable(collectionName);
      
      await this.db
        .delete(table)
        .where(eq(table.id, id));
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw new Error(`Failed to delete document from ${collectionName}`);
    }
  }

  /**
   * Query documents with a condition
   */
  async query<T>(
    collectionName: string,
    field: string,
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=',
    value: string | number | boolean | Date
  ): Promise<T[]> {
    try {
      const table = this.getTable(collectionName);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableField = (table as Record<string, any>)[field];

      if (!tableField) {
        throw new Error(`Field '${field}' does not exist in table '${collectionName}'`);
      }

      let whereCondition;

      switch (operator) {
        case '==':
          whereCondition = eq(tableField, value);
          break;
        case '!=':
          whereCondition = ne(tableField, value);
          break;
        case '<':
          whereCondition = lt(tableField, value as number | Date);
          break;
        case '<=':
          whereCondition = lte(tableField, value as number | Date);
          break;
        case '>':
          whereCondition = gt(tableField, value as number | Date);
          break;
        case '>=':
          whereCondition = gte(tableField, value as number | Date);
          break;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }

      const result = await this.db
        .select()
        .from(table)
        .where(whereCondition);

      return result as T[];
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw new Error(`Failed to query ${collectionName}`);
    }
  }

  /**
   * Get table schema from collection name
   * Maps collection names to Drizzle table schemas
   * Uses type assertion to allow dynamic collection naming (Firebase compatibility)
   */
  private getTable(collectionName: string) {
    const table = this.schemas[collectionName as keyof typeof schemaMap];
    
    if (!table) {
      throw new Error(`Table schema for '${collectionName}' not found`);
    }

    return table;
  }

  /**
   * Get table field by name
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getTableField(table: Record<string, any>, fieldName: string) {
    const field = table[fieldName];
    
    if (!field) {
      throw new Error(`Field '${fieldName}' does not exist in table`);
    }
    
    return field;
  }
}
