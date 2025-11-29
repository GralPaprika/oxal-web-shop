// This file contains server-only dependencies that use Node.js APIs
// It should never be imported in Client Components
import 'server-only';

import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '@/types/container.types';
import { IDatabase } from '@/infrastructure/firebase/database.interface';
import { FirestoreDatabase } from '@/infrastructure/firebase/firestore.database';
import { IFirebaseService } from '@/infrastructure/firebase/firebase.interface';
import { FirebaseService } from '@/infrastructure/firebase/firebase.config';
import type { IAuthRepository } from '@/domain/auth/auth.interface';
import { SupabaseAuthRepository } from '@/infrastructure/auth/SupabaseAuthRepository';
import type { ISupabaseAuth } from '@/infrastructure/supabase/auth';
import { SupabaseAuthService } from '@/infrastructure/supabase/auth';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { LogoutUseCase } from '@/application/usecases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';

// Storage
import { IStorageService } from '@/domain/storage/storage.interface';
import { FirebaseStorageService } from '@/infrastructure/services/FirebaseStorageService';
import { UploadFileUseCase, DeleteFileUseCase } from '@/application/usecases/storage/FileUploadUseCase';

// User Management
import type { IUserRepository } from '@/domain/user/user.repository';
import { FirestoreUserRepository } from '@/infrastructure/user/FirestoreUserRepository';
import { GetAllUsersUseCase, GetUsersByRoleUseCase, GetUserByIdUseCase } from '@/application/usecases/user/GetUsersUseCase';
import { CreateUserUseCase } from '@/application/usecases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '@/application/usecases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/application/usecases/user/DeleteUserUseCase';

// Product Management
import type { IProductRepository } from '@/domain/product/product.repository';
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository';
import type { ISupabaseService } from '@/infrastructure/supabase/supabase.interface';
import { SupabaseService } from '@/infrastructure/supabase/supabase.config';
import { GetAllProductsUseCase, GetProductByIdUseCase, GetProductByCodeUseCase, GetProductCountUseCase } from '@/application/usecases/product/GetProductsUseCase';
import { CreateProductUseCase } from '@/application/usecases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@/application/usecases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@/application/usecases/product/DeleteProductUseCase';
import { GetCategoriesUseCase } from '@/application/usecases/product/GetCategoriesUseCase';
import { ValidateCanStarProductUseCase } from '@/application/usecases/product/ValidateCanStarProductUseCase';
import { GetStarredProductsCountUseCase } from '@/application/usecases/product/GetStarredProductsCountUseCase';

// This will be our main DI container
export const serverContainer = new Container();

// Firebase service binding
serverContainer.bind<IFirebaseService>(TYPES.FirebaseService).to(FirebaseService).inSingletonScope();

// Database binding - clients depend on IDatabase interface, not FirestoreDatabase
serverContainer.bind<IDatabase>(TYPES.Database).to(FirestoreDatabase).inSingletonScope();

// Supabase service binding - THIS CONTAINS NODE.JS ONLY CODE (postgres)
serverContainer.bind<ISupabaseService>(TYPES.SupabaseService).to(SupabaseService).inSingletonScope();

// Storage service binding
serverContainer.bind<IStorageService>(TYPES.StorageService).to(FirebaseStorageService).inSingletonScope();

// Supabase Auth service binding
serverContainer.bind<ISupabaseAuth>(TYPES.SupabaseAuth).to(SupabaseAuthService).inSingletonScope();

// Authentication repository binding (uses Supabase implementation)
serverContainer.bind<IAuthRepository>(TYPES.AuthRepository).to(SupabaseAuthRepository).inSingletonScope();

// Authentication use cases binding
serverContainer.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
serverContainer.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
serverContainer.bind<GetCurrentUserUseCase>(TYPES.GetCurrentUserUseCase).to(GetCurrentUserUseCase);

// User Management bindings
serverContainer.bind<IUserRepository>(TYPES.UserRepository).to(FirestoreUserRepository).inSingletonScope();
serverContainer.bind<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase).to(GetAllUsersUseCase);
serverContainer.bind<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase).to(GetUsersByRoleUseCase);
serverContainer.bind<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase).to(GetUserByIdUseCase);
serverContainer.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
serverContainer.bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
serverContainer.bind<DeleteUserUseCase>(TYPES.DeleteUserUseCase).to(DeleteUserUseCase);

// Product Management bindings
serverContainer.bind<IProductRepository>(TYPES.ProductRepository).to(SupabaseProductRepository).inSingletonScope();
serverContainer.bind<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase).to(GetAllProductsUseCase);
serverContainer.bind<GetProductByIdUseCase>(TYPES.GetProductByIdUseCase).to(GetProductByIdUseCase);
serverContainer.bind<GetProductByCodeUseCase>(TYPES.GetProductByCodeUseCase).to(GetProductByCodeUseCase);
serverContainer.bind<GetProductCountUseCase>(TYPES.GetProductCountUseCase).to(GetProductCountUseCase);
serverContainer.bind<CreateProductUseCase>(TYPES.CreateProductUseCase).to(CreateProductUseCase);
serverContainer.bind<UpdateProductUseCase>(TYPES.UpdateProductUseCase).to(UpdateProductUseCase);
serverContainer.bind<DeleteProductUseCase>(TYPES.DeleteProductUseCase).to(DeleteProductUseCase);
serverContainer.bind<GetCategoriesUseCase>(TYPES.GetCategoriesUseCase).to(GetCategoriesUseCase);
serverContainer.bind<ValidateCanStarProductUseCase>(TYPES.ValidateCanStarProductUseCase).to(ValidateCanStarProductUseCase);
serverContainer.bind<GetStarredProductsCountUseCase>(TYPES.GetStarredProductsCountUseCase).to(GetStarredProductsCountUseCase);

// Storage use cases binding
serverContainer.bind<UploadFileUseCase>(TYPES.UploadFileUseCase).to(UploadFileUseCase);
serverContainer.bind<DeleteFileUseCase>(TYPES.DeleteFileUseCase).to(DeleteFileUseCase);

export { TYPES };
