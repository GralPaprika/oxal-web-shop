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

// This will be our main DI container
export const container = new Container();

// Firebase service binding
container.bind<IFirebaseService>(TYPES.FirebaseService).to(FirebaseService).inSingletonScope();

// Database binding - clients depend on IDatabase interface, not FirestoreDatabase
container.bind<IDatabase>(TYPES.Database).to(FirestoreDatabase).inSingletonScope();

// Authentication repository binding
container.bind<IAuthRepository>(TYPES.AuthRepository).to(FirebaseAuthRepository).inSingletonScope();

// Authentication use cases binding
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
container.bind<GetCurrentUserUseCase>(TYPES.GetCurrentUserUseCase).to(GetCurrentUserUseCase);

export { TYPES };