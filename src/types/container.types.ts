// Dependency injection container type identifiers
export const TYPES = {
  // Database
  Database: Symbol.for('Database'),
  FirebaseService: Symbol.for('FirebaseService'),
  
  // Add your service identifiers here as needed
} as const;