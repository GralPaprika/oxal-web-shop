import { injectable } from 'inversify';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ISupabaseAuth, AuthSignupResult, AuthSigninResult, AuthUserData, AuthStateChangeListener, AuthStateChangeEvent } from './supabase-auth.interface';

@injectable()
export class SupabaseAuthService implements ISupabaseAuth {
  private supabaseClient: SupabaseClient;
  private listeners: Set<AuthStateChangeListener> = new Set();

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

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

  async signin(email: string, password: string): Promise<AuthSigninResult> {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user || !data.session) throw new Error('Failed to sign in');

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

  async signout(): Promise<void> {
    try {
      const { error } = await this.supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Signout error:', error);
      throw this.handleAuthError(error);
    }
  }

  async getCurrentUser(): Promise<AuthUserData | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabaseClient.auth.getUser();

      if (error || !user) return null;

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

  onAuthStateChange(listener: AuthStateChangeListener): () => void {
    this.listeners.add(listener);

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

      const authEvent: AuthStateChangeEvent = {
        event: event as AuthStateChangeEvent['event'],
        user,
        token: session?.access_token,
      };

      this.listeners.forEach((cb) => cb(authEvent));
    });

    return () => {
      this.listeners.delete(listener);
      data?.subscription?.unsubscribe();
    };
  }

  private handleAuthError(error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`Authentication error: ${error.message}`);
    }
    return new Error('An unknown authentication error occurred');
  }
}
