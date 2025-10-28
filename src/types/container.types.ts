// Dependency injection container type identifiers
export const TYPES = {
  // Database
  Database: Symbol.for('Database'),
  FirebaseService: Symbol.for('FirebaseService'),
  
  // Storage
  StorageService: Symbol.for('StorageService'),
  UploadFileUseCase: Symbol.for('UploadFileUseCase'),
  DeleteFileUseCase: Symbol.for('DeleteFileUseCase'),
  
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
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  
  // Product Management
  ProductRepository: Symbol.for('ProductRepository'),
  GetAllProductsUseCase: Symbol.for('GetAllProductsUseCase'),
  GetProductByIdUseCase: Symbol.for('GetProductByIdUseCase'),
  GetProductByCodeUseCase: Symbol.for('GetProductByCodeUseCase'),
  GetProductCountUseCase: Symbol.for('GetProductCountUseCase'),
  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
  UpdateProductUseCase: Symbol.for('UpdateProductUseCase'),
  DeleteProductUseCase: Symbol.for('DeleteProductUseCase'),
  GetCategoriesUseCase: Symbol.for('GetCategoriesUseCase'),
} as const;