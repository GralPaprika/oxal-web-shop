import { checkAuthStatus, getCurrentUser } from '@/lib/auth';
import type { User } from '@/domain/user/user.entity';

export interface AuthCheckResult {
  success: boolean;
  error?: string;
  currentUser?: User;
}

/**
 * Verifies admin access by checking authentication and admin role
 */
export async function verifyAdminAccess(): Promise<AuthCheckResult> {
  try {
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'Unauthorized: Authentication required'
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized: Admin privileges required'
      };
    }

    return {
      success: true,
      currentUser
    };
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return {
      success: false,
      error: 'Authentication verification failed'
    };
  }
}

/**
 * Wraps server actions with admin authentication and passes currentUser
 * Returns error response on auth failure or exceptions
 * 
 * @example
 * export const updateUser = withAdminAuth(async (currentUser, id, data) => {
 *   if (currentUser.id === id && data.role !== 'admin') {
 *     return { success: false, error: 'Cannot remove your own admin role' };
 *   }
 *   const user = await updateUserUseCase.execute(id, data);
 *   return { success: true, user };
 * });
 */
export function withAdminAuth<TArgs extends unknown[], TReturn extends { success: boolean; error?: string }>(
  fn: (currentUser: User, ...args: TArgs) => Promise<TReturn>,
  context?: string
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const authResult = await verifyAdminAccess();
    if (!authResult.success) {
      return { success: false, error: authResult.error } as TReturn;
    }

    try {
      return await fn(authResult.currentUser!, ...args);
    } catch (error) {
      const errorContext = context ? `${context} - ` : '';
      console.error(`${errorContext}Server action error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      } as TReturn;
    }
  };
}

/**
 * Wraps server actions with admin authentication
 * Returns error response on auth failure or exceptions
 * 
 * @example
 * export const createProduct = withAdminAuthOnly(async (data) => {
 *   const product = await createProductUseCase.execute(data);
 *   return { success: true, product };
 * });
 */
export function withAdminAuthOnly<TArgs extends unknown[], TReturn extends { success: boolean; error?: string }>(
  fn: (...args: TArgs) => Promise<TReturn>,
  context?: string
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const authResult = await verifyAdminAccess();
    if (!authResult.success) {
      return { success: false, error: authResult.error } as TReturn;
    }

    try {
      return await fn(...args);
    } catch (error) {
      const errorContext = context ? `${context} - ` : '';
      console.error(`${errorContext}Server action error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      } as TReturn;
    }
  };
}
