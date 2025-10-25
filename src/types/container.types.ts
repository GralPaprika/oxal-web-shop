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
  
  // User Management
  UserRepository: Symbol.for('UserRepository'),
  GetAllUsersUseCase: Symbol.for('GetAllUsersUseCase'),
  GetUsersByRoleUseCase: Symbol.for('GetUsersByRoleUseCase'),
  GetUserByIdUseCase: Symbol.for('GetUserByIdUseCase'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  
  // Add your service identifiers here as needed
} as const;