export interface AuthSignupResult {
  userId: string;
  email: string;
  role: number;
}

export interface AuthSigninResult extends AuthSignupResult {
  token: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface AuthUserData {
  userId: string;
  email: string;
  role: number;
  displayName?: string;
  photoURL?: string;
}

export interface AuthStateChangeEvent {
  event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';
  user: AuthUserData | null;
  token?: string;
}

export type AuthStateChangeListener = (event: AuthStateChangeEvent) => void;

export interface ISupabaseAuth {
  signup(email: string, password: string, displayName?: string, role?: number): Promise<AuthSignupResult>;

  signin(email: string, password: string): Promise<AuthSigninResult>;

  signout(): Promise<void>;

  getCurrentUser(): Promise<AuthUserData | null>;

  onAuthStateChange(listener: AuthStateChangeListener): () => void;
}
