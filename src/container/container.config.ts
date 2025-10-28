import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '@/types/container.types';
import { IDatabase } from '@/database/database.interface';
import { FirestoreDatabase } from '@/database/firestore.database';
import { IFirebaseService } from '@/database/firebase.interface';
import { FirebaseService } from '@/database/firebase.config';
import type { IAuthRepository } from '@/domain/auth/auth.interface';
import { FirebaseAuthRepository } from '@/infrastructure/auth/FirebaseAuthRepository';
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
import { FirestoreProductRepository } from '@/infrastructure/repositories/FirestoreProductRepository';
import { GetAllProductsUseCase, GetProductByIdUseCase, GetProductByCodeUseCase, GetProductCountUseCase } from '@/application/usecases/product/GetProductsUseCase';
import { CreateProductUseCase } from '@/application/usecases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@/application/usecases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@/application/usecases/product/DeleteProductUseCase';
import { GetCategoriesUseCase } from '@/application/usecases/product/GetCategoriesUseCase';

// This will be our main DI container
export const container = new Container();

// Firebase service binding
container.bind<IFirebaseService>(TYPES.FirebaseService).to(FirebaseService).inSingletonScope();

// Database binding - clients depend on IDatabase interface, not FirestoreDatabase
container.bind<IDatabase>(TYPES.Database).to(FirestoreDatabase).inSingletonScope();

// Storage service binding
container.bind<IStorageService>(TYPES.StorageService).to(FirebaseStorageService).inSingletonScope();

// Authentication repository binding
container.bind<IAuthRepository>(TYPES.AuthRepository).to(FirebaseAuthRepository).inSingletonScope();

// Authentication use cases binding
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
container.bind<GetCurrentUserUseCase>(TYPES.GetCurrentUserUseCase).to(GetCurrentUserUseCase);

// User Management bindings
container.bind<IUserRepository>(TYPES.UserRepository).to(FirestoreUserRepository).inSingletonScope();
container.bind<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase).to(GetAllUsersUseCase);
container.bind<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase).to(GetUsersByRoleUseCase);
container.bind<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase).to(GetUserByIdUseCase);
container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
container.bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
container.bind<DeleteUserUseCase>(TYPES.DeleteUserUseCase).to(DeleteUserUseCase);

// Product Management bindings
container.bind<IProductRepository>(TYPES.ProductRepository).to(FirestoreProductRepository).inSingletonScope();
container.bind<GetAllProductsUseCase>(TYPES.GetAllProductsUseCase).to(GetAllProductsUseCase);
container.bind<GetProductByIdUseCase>(TYPES.GetProductByIdUseCase).to(GetProductByIdUseCase);
container.bind<GetProductByCodeUseCase>(TYPES.GetProductByCodeUseCase).to(GetProductByCodeUseCase);
container.bind<GetProductCountUseCase>(TYPES.GetProductCountUseCase).to(GetProductCountUseCase);
container.bind<CreateProductUseCase>(TYPES.CreateProductUseCase).to(CreateProductUseCase);
container.bind<UpdateProductUseCase>(TYPES.UpdateProductUseCase).to(UpdateProductUseCase);
container.bind<DeleteProductUseCase>(TYPES.DeleteProductUseCase).to(DeleteProductUseCase);
container.bind<GetCategoriesUseCase>(TYPES.GetCategoriesUseCase).to(GetCategoriesUseCase);

// Storage use cases binding
container.bind<UploadFileUseCase>(TYPES.UploadFileUseCase).to(UploadFileUseCase);
container.bind<DeleteFileUseCase>(TYPES.DeleteFileUseCase).to(DeleteFileUseCase);

export { TYPES };