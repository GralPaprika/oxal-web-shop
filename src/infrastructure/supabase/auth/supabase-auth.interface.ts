/**
 * Supabase Authentication Interface
 * Defines the contract for authentication operations with Supabase
 */

/**
 * User authentication data returned from signup
 */
export interface AuthSignupResult {
  userId: string;
  email: string;
  role: number;
}

/**
 * User authentication data returned from signin
 */
export interface AuthSigninResult extends AuthSignupResult {
  token: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

/**
 * User data retrieved from getCurrentUser or getUserById
 */
export interface AuthUserData {
  userId: string;
  email: string;
  role: number;
  displayName?: string;
  photoURL?: string;
}

/**
 * Auth state change event
 */
export interface AuthStateChangeEvent {
  event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';
  user: AuthUserData | null;
  token?: string;
}

/**
 * Auth state change listener
 */
export type AuthStateChangeListener = (event: AuthStateChangeEvent) => void;

export interface ISupabaseAuth {
  /**
   * Sign up a new user
   */
  signup(email: string, password: string, displayName?: string, role?: number): Promise<AuthSignupResult>;

  /**
   * Sign in an existing user
   */
  signin(email: string, password: string): Promise<AuthSigninResult>;

  /**
   * Sign out the current user
   */
  signout(): Promise<void>;

  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): Promise<AuthUserData | null>;

  /**
   * Listen to auth state changes
   * Returns unsubscribe function
   */
  onAuthStateChange(listener: AuthStateChangeListener): () => void;
}
