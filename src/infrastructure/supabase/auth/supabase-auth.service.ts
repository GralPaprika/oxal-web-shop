/**
 * Supabase Authentication Service
 * Handles user authentication, session management, and user data operations
 * Using Supabase built-in auth system
 */

import { injectable } from 'inversify';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ISupabaseAuth, AuthSignupResult, AuthSigninResult, AuthUserData, AuthStateChangeListener, AuthStateChangeEvent } from './supabase-auth.interface';

@injectable()
export class SupabaseAuthService implements ISupabaseAuth {
  private supabaseClient: SupabaseClient;
  private listeners: Set<AuthStateChangeListener> = new Set();

  constructor() {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Sign up a new user
   */
  async signup(email: string, password: string, displayName?: string, role: number = 3): Promise<AuthSignupResult> {
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
  async signin(email: string, password: string): Promise<AuthSigninResult> {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user || !data.session) throw new Error('Failed to sign in');

      // Get role and displayName from user metadata
      const role = (data.user.user_metadata?.role as number) || 3; // Default to CLIENT if not found
      const displayName = data.user.user_metadata?.display_name as string | undefined;

      return {
        userId: data.user.id,
        email: data.user.email || email,
        role,
        token: data.session.access_token,
        displayName,
        emailVerified: !!data.user.email_confirmed_at,
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
  async getCurrentUser(): Promise<AuthUserData | null> {
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
   * Listen to auth state changes
   * Sets up internal Supabase listener and calls registered listeners
   */
  onAuthStateChange(listener: AuthStateChangeListener): () => void {
    this.listeners.add(listener);

    // Subscribe to Supabase auth state changes if not already subscribed
    const { data } = this.supabaseClient.auth.onAuthStateChange(async (event, session) => {
      let user: AuthUserData | null = null;

      if (session?.user) {
        const displayName = session.user.user_metadata?.display_name as string | undefined;
        const role = (session.user.user_metadata?.role as number) || 3;

        user = {
          userId: session.user.id,
          email: session.user.email || '',
          role,
          displayName,
          photoURL: undefined,
        };
      }

      // Notify all listeners
      const authEvent: AuthStateChangeEvent = {
        event: event as AuthStateChangeEvent['event'],
        user,
        token: session?.access_token,
      };

      this.listeners.forEach((cb) => cb(authEvent));
    });

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
      data?.subscription?.unsubscribe();
    };
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
