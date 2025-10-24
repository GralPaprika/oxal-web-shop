import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '@/types/container.types';
import { IDatabase } from '@/database/database.interface';
import { FirestoreDatabase } from '@/database/firestore.database';
import { IFirebaseService } from '@/database/firebase.interface';
import { FirebaseService } from '@/database/firebase.config';

// This will be our main DI container
export const container = new Container();

// Firebase service binding
container.bind<IFirebaseService>(TYPES.FirebaseService).to(FirebaseService).inSingletonScope();

// Database binding - clients depend on IDatabase interface, not FirestoreDatabase
container.bind<IDatabase>(TYPES.Database).to(FirestoreDatabase).inSingletonScope();

export { TYPES };