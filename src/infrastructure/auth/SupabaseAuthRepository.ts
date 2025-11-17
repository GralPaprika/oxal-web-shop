/**
 * Supabase Authentication Repository
 * Implements IAuthRepository using Supabase Auth service
 * Adapter Pattern: adapts Supabase auth to match the domain's IAuthRepository interface
 */

import { injectable, inject } from 'inversify';
import type { IAuthRepository, LoginCredentials, AuthResult, User } from '@/domain/auth/auth.interface';
import type { ISupabaseAuth } from '@/infrastructure/supabase/auth';
import { TYPES } from '@/types/container.types';

@injectable()
export class SupabaseAuthRepository implements IAuthRepository {
  constructor(@inject(TYPES.SupabaseAuth) private supabaseAuth: ISupabaseAuth) {}

  /**
   * Sign in a user with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResult> {
    const result = await this.supabaseAuth.signin(credentials.email, credentials.password);

    return {
      user: {
        uid: result.userId,
        email: result.email,
        displayName: undefined,
        photoURL: undefined,
        emailVerified: false,
        role: this.getRoleLabel(result.role),
      },
      token: result.token,
    };
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    await this.supabaseAuth.signout();
  }

  /**
   * Get the currently authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    const user = await this.supabaseAuth.getCurrentUser();
    if (!user) return null;

    return {
      uid: user.userId,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: false,
      role: this.getRoleLabel(user.role),
    };
  }

  /**
   * Listen to authentication state changes
   * Note: Supabase handles this differently, this is a placeholder
   */
  onAuthStateChanged(): () => void {
    // Supabase doesn't support traditional observers in server context
    // This would be implemented in the client layer
    console.warn('onAuthStateChanged not implemented for Supabase server context');
    return () => {};
  }

  /**
   * Convert numeric role code to string label
   */
  private getRoleLabel(roleCode: number): string {
    const roleMap: Record<number, string> = {
      1: 'admin',
      2: 'cashier',
      3: 'client',
    };
    return roleMap[roleCode] || 'client';
  }
}
