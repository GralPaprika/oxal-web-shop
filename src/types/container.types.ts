// Dependency injection container type identifiers
export const TYPES = {
  // Database
  Database: Symbol.for('Database'),
  FirebaseService: Symbol.for('FirebaseService'),
  
  // Authentication
  AuthRepository: Symbol.for('AuthRepository'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  GetCurrentUserUseCase: Symbol.for('GetCurrentUserUseCase'),
  
  // Add your service identifiers here as needed
} as const;