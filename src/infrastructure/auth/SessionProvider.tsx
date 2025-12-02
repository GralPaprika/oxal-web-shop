'use client';

import { ReactNode, useCallback, useState } from 'react';
import { SessionContext, type ISessionContext } from './supabase-session.context';
import type { AuthUserData } from '@/infrastructure/supabase/auth/supabase-auth.interface';

export interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
