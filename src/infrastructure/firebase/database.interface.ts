export interface IDatabase {
  create<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string>;
  getById<T>(collection: string, id: string): Promise<T | null>;
  getAll<T>(collection: string): Promise<T[]>;
  getAllPaginated<T>(collection: string, pageSize: number, pageOffset: number): Promise<T[]>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  
  query<T>(collection: string, field: string, operator: '==' | '!=' | '<' | '<=' | '>' | '>=', value: string | number | boolean | Date): Promise<T[]>;
}
