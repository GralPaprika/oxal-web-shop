/**
 * Session Provider Component
 * 
 * Simplified for SSR approach:
 * - Admin pages are server components (middleware handles protection)
 * - SessionProvider only manages client-side login UI state
 * - No token injection logic (server handles auth)
 */

'use client';

import { ReactNode, useCallback, useState } from 'react';
import { SessionContext, type ISessionContext } from './supabase-session.context';
import type { ISupabaseAuth } from '@/infrastructure/supabase/auth';
import type { AuthUserData } from '@/infrastructure/supabase/auth/supabase-auth.interface';
import { container } from '@/src/container/container.config';
import { TYPES } from '@/src/types/container.types';

export interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabaseAuth = container.get<ISupabaseAuth>(TYPES.SupabaseAuth);

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await supabaseAuth.signout();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseAuth]);

  const value: ISessionContext = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    accessToken: null, // Not used in SSR approach
    signOut: handleSignOut,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
