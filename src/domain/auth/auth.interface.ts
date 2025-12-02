export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface IAuthRepository {
  signIn(credentials: LoginCredentials): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}