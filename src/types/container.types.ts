// Dependency injection container type identifiers
export const TYPES = {
  // Database
  Database: Symbol.for('Database'),
  FirebaseService: Symbol.for('FirebaseService'),
  SupabaseService: Symbol.for('SupabaseService'),
  
  // Authentication
  AuthRepository: Symbol.for('AuthRepository'),
  SupabaseAuth: Symbol.for('SupabaseAuth'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  GetCurrentUserUseCase: Symbol.for('GetCurrentUserUseCase'),
  
  // Storage
  StorageService: Symbol.for('StorageService'),
  UploadFileUseCase: Symbol.for('UploadFileUseCase'),
  DeleteFileUseCase: Symbol.for('DeleteFileUseCase'),
  
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
  ValidateCanStarProductUseCase: Symbol.for('ValidateCanStarProductUseCase'),
  GetStarredProductsCountUseCase: Symbol.for('GetStarredProductsCountUseCase'),
} as const;