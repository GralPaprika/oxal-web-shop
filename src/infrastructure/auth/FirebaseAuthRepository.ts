import { injectable, inject } from 'inversify';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import type { IAuthRepository, LoginCredentials, AuthResult, User } from '@/domain/auth/auth.interface';
import type { IFirebaseService } from '@/database/firebase.interface';
import { TYPES } from '@/types/container.types';

@injectable()
export class FirebaseAuthRepository implements IAuthRepository {
  private auth: Auth;

  constructor(
    @inject(TYPES.FirebaseService) private firebaseService: IFirebaseService
  ) {
    this.auth = this.firebaseService.getAuth();
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      const user = this.mapFirebaseUserToDomain(userCredential.user);
      const token = await userCredential.user.getIdToken();

      return { user, token };
    } catch (error) {
      throw this.mapFirebaseError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error) {
      throw new Error(`Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.auth.currentUser;
    return firebaseUser ? this.mapFirebaseUserToDomain(firebaseUser) : null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, (firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUserToDomain(firebaseUser) : null;
      callback(user);
    });
  }

  private mapFirebaseUserToDomain(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
    };
  }

  private mapFirebaseError(error: any): Error {
    const errorCode = error?.code;
    
    switch (errorCode) {
      case 'auth/user-not-found':
        return new Error('No user found with this email address');
      case 'auth/wrong-password':
        return new Error('Incorrect password');
      case 'auth/invalid-email':
        return new Error('Invalid email address');
      case 'auth/user-disabled':
        return new Error('This account has been disabled');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Please try again later');
      default:
        return new Error(`Authentication failed: ${error?.message || 'Unknown error'}`);
    }
  }
}