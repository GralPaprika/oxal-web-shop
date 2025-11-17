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
   * Update user profile
   */
  updateProfile(displayName?: string, photoURL?: string): Promise<void>;

  /**
   * Change user password
   */
  changePassword(newPassword: string): Promise<void>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;

  /**
   * Verify email
   */
  verifyEmail(token: string): Promise<void>;

  /**
   * Get user by ID
   */
  getUserById(userId: string): Promise<AuthUserData | null>;

  /**
   * Delete user account
   */
  deleteUser(userId: string): Promise<void>;
}
