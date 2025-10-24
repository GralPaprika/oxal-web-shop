// Database abstraction interface - clients depend on this, not concrete implementations
export interface IDatabase {
  // Generic CRUD operations
  create<T>(collection: string, data: Omit<T, 'id'>): Promise<string>;
  getById<T>(collection: string, id: string): Promise<T | null>;
  getAll<T>(collection: string): Promise<T[]>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  
  // Query operations
  query<T>(collection: string, field: string, operator: '==' | '!=' | '<' | '<=' | '>' | '>=', value: any): Promise<T[]>;
}