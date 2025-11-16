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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Failed to create user');

      // Create user record in users table
      const { error: insertError } = await this.supabaseClient.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        displayName: displayName || null,
        role,
        emailVerified: false,
        status: 1, // ACTIVE
      });

      if (insertError) throw insertError;

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

      // Fetch user details including role
      const { data: userData, error: fetchError } = await this.supabaseClient
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (fetchError) {
        console.warn('Failed to fetch user role:', fetchError);
      }

      return {
        userId: data.user.id,
        email: data.user.email || email,
        role: userData?.role || 3, // Default to CLIENT if not found
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

      // Fetch user details from users table
      const { data, error: fetchError } = await this.supabaseClient
        .from('users')
        .select('role, displayName, photoURL')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.warn('Failed to fetch user details:', fetchError);
        return {
          userId: user.id,
          email: user.email || '',
          role: 3, // Default to CLIENT
        };
      }

      return {
        userId: user.id,
        email: user.email || '',
        role: data?.role || 3,
        displayName: data?.displayName || undefined,
        photoURL: data?.photoURL || undefined,
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
      const {
        data: { user },
        error: authError,
      } = await this.supabaseClient.auth.getUser();

      if (authError || !user) throw new Error('Not authenticated');

      const updateData: Record<string, unknown> = {};
      if (displayName !== undefined) updateData.displayName = displayName;
      if (photoURL !== undefined) updateData.photoURL = photoURL;

      const { error } = await this.supabaseClient
        .from('users')
        .update(updateData)
        .eq('id', user.id);

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
      const { data, error } = await this.supabaseClient
        .from('users')
        .select('id, email, role, displayName, photoURL')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return {
        userId: data.id,
        email: data.email,
        role: data.role || 3,
        displayName: data.displayName || undefined,
        photoURL: data.photoURL || undefined,
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      // Delete user record from users table
      const { error: deleteUserError } = await this.supabaseClient.from('users').delete().eq('id', userId);

      if (deleteUserError) throw deleteUserError;

      // Delete auth user (requires admin key or user to be authenticated)
      // This is typically done through Supabase admin API
      console.log(`User ${userId} deleted from users table`);
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
