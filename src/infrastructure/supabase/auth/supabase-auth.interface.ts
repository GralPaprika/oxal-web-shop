/**
 * Supabase Authentication Interface
 * Defines the contract for authentication operations with Supabase
 */

export interface ISupabaseAuth {
  /**
   * Sign up a new user
   */
  signup(email: string, password: string, displayName?: string): Promise<{ userId: string; email: string }>;

  /**
   * Sign in an existing user
   */
  signin(email: string, password: string): Promise<{ userId: string; email: string; token: string }>;

  /**
   * Sign out the current user
   */
  signout(): Promise<void>;

  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): Promise<{ userId: string; email: string; displayName?: string; photoURL?: string } | null>;

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
  getUserById(userId: string): Promise<{ userId: string; email: string; displayName?: string; photoURL?: string } | null>;

  /**
   * Delete user account
   */
  deleteUser(userId: string): Promise<void>;
}
