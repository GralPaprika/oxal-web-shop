/**
 * Supabase Authentication Service
 * Handles user authentication, session management, and user data operations
 * Using Supabase built-in auth system
 */

import { injectable } from 'inversify';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ISupabaseAuth } from './supabase-auth.interface';

@injectable()
export class SupabaseAuthService implements ISupabaseAuth {
  private supabaseClient: SupabaseClient;

  constructor() {
    // Get the Postgres client and create a Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Sign up a new user
   */
  async signup(email: string, password: string, displayName?: string, role: number = 3): Promise<{ userId: string; email: string; role: number }> {
    try {
      const { data, error } = await this.supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Failed to create user');

      return {
        userId: data.user.id,
        email: data.user.email || email,
        role,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in an existing user
   */
  async signin(email: string, password: string): Promise<{ userId: string; email: string; role: number; token: string }> {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user || !data.session) throw new Error('Failed to sign in');

      // Get role from user metadata
      const role = (data.user.user_metadata?.role as number) || 3; // Default to CLIENT if not found

      return {
        userId: data.user.id,
        email: data.user.email || email,
        role,
        token: data.session.access_token,
      };
    } catch (error) {
      console.error('Signin error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   */
  async signout(): Promise<void> {
    try {
      const { error } = await this.supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Signout error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get the currently authenticated user
   */
  async getCurrentUser(): Promise<{
    userId: string;
    email: string;
    role: number;
    displayName?: string;
    photoURL?: string;
  } | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabaseClient.auth.getUser();

      if (error || !user) return null;

      // Get user metadata from Supabase Auth
      const displayName = user.user_metadata?.display_name as string | undefined;
      const role = (user.user_metadata?.role as number) || 3; // Default to CLIENT

      return {
        userId: user.id,
        email: user.email || '',
        role,
        displayName,
        photoURL: undefined,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(displayName?: string, photoURL?: string): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {};
      if (displayName !== undefined) updateData.display_name = displayName;
      if (photoURL !== undefined) updateData.photoURL = photoURL;

      const { error } = await this.supabaseClient.auth.updateUser({
        data: updateData,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Update profile error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Change user password
   */
  async changePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await this.supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Change password error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Send reset email error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const { error } = await this.supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      const { error } = await this.supabaseClient.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) throw error;
    } catch (error) {
      console.error('Verify email error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{
    userId: string;
    email: string;
    role: number;
    displayName?: string;
    photoURL?: string;
  } | null> {
    try {
      // Note: This requires admin access or is used in server context
      // In a production app, you might need the admin API for this
      const { data, error } = await this.supabaseClient.auth.admin.getUserById(userId);

      if (error || !data.user) {
        return null;
      }

      const displayName = data.user.user_metadata?.display_name as string | undefined;
      const role = (data.user.user_metadata?.role as number) || 3;

      return {
        userId: data.user.id,
        email: data.user.email || '',
        role,
        displayName,
        photoURL: undefined,
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return null;
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      // Supabase Auth handles user deletion via admin API
      const { error } = await this.supabaseClient.auth.admin.deleteUser(userId);

      if (error) throw error;

      console.log(`User ${userId} deleted from Supabase Auth`);
    } catch (error) {
      console.error('Delete user error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`Authentication error: ${error.message}`);
    }
    return new Error('An unknown authentication error occurred');
  }
}
