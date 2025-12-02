import { createContext, useContext } from 'react';
import type { AuthUserData } from '@/infrastructure/supabase/auth/supabase-auth.interface';

export interface ISessionContext {
  user: AuthUserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  signOut(): Promise<void>;
}

export const SessionContext = createContext<ISessionContext | undefined>(undefined);

export const useSession = (): ISessionContext => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};
