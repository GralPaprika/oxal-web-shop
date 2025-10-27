'use server';

import { container } from '@/container/container.config';
import { GetAllUsersUseCase, GetUsersByRoleUseCase } from '@/application/usecases/user/GetUsersUseCase';
import { UpdateUserUseCase } from '@/application/user/UpdateUserUseCase';
import { CreateUserUseCase, CreateUserRequest } from '@/application/user/CreateUserUseCase';
import { DeleteUserUseCase } from '@/application/user/DeleteUserUseCase';
import { TYPES } from '@/types/container.types';
import type { User } from '@/domain/user/user.entity';
import { checkAuthStatus, getCurrentUser } from '@/lib/auth';

async function verifyAdminAccess(): Promise<{ success: boolean; error?: string; currentUser?: User }> {
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

function withAdminAuth<TArgs extends unknown[], TReturn>(
  fn: (currentUser: User, ...args: TArgs) => Promise<TReturn>
) {
  return async (...args: TArgs): Promise<TReturn | { success: false; error: string }> => {
    const authResult = await verifyAdminAccess();
    if (!authResult.success) {
      return { success: false, error: authResult.error! } as TReturn;
    }
    
    try {
      return await fn(authResult.currentUser!, ...args);
    } catch (error) {
      console.error('Error in authenticated function:', error);
      return { 
        success: false, 
        error: 'Operation failed' 
      } as TReturn;
    }
  };
}

function withAdminAuthOnly<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
) {
  return async (...args: TArgs): Promise<TReturn | { success: false; error: string }> => {
    const authResult = await verifyAdminAccess();
    if (!authResult.success) {
      return { success: false, error: authResult.error! } as TReturn;
    }
    
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Error in authenticated function:', error);
      return { 
        success: false, 
        error: 'Operation failed' 
      } as TReturn;
    }
  };
}

export const getAllUsers = withAdminAuthOnly(async (): Promise<{ success: boolean; users?: User[]; error?: string }> => {
  const getAllUsersUseCase = container.get<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase);
  const users = await getAllUsersUseCase.execute();
  
  return {
    success: true,
    users
  };
});

export const getUsersByRole = withAdminAuthOnly(async (role: User['role']): Promise<{ success: boolean; users?: User[]; error?: string }> => {
  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const users = await getUsersByRoleUseCase.execute(role);
  
  return {
    success: true,
    users
  };
});

export const getAdminUsers = withAdminAuthOnly(async (): Promise<{ success: boolean; users?: User[]; error?: string }> => {
  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const admins = await getUsersByRoleUseCase.execute('admin');
  
  return {
    success: true,
    users: admins
  };
});

export const updateUser = withAdminAuth(async (currentUser: User, userData: {
  id: string;
  displayName?: string;
  email?: string;
  role?: 'admin' | 'cashier';
  status?: 'active' | 'inactive' | 'suspended';
}): Promise<{ success: boolean; user?: User; error?: string }> => {
  if (currentUser.id === userData.id && userData.role && userData.role !== 'admin') {
    return {
      success: false,
      error: 'Cannot remove admin privileges from your own account'
    };
  }

  if (currentUser.id === userData.id && userData.status && userData.status !== 'active') {
    return {
      success: false,
      error: 'Cannot change status of your own account'
    };
  }

  const updateUserUseCase = container.get<UpdateUserUseCase>(TYPES.UpdateUserUseCase);
  return await updateUserUseCase.execute(userData);
});

export const createUser = withAdminAuth(async (currentUser: User, userData: CreateUserRequest) => {
  const createUserUseCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);
  return await createUserUseCase.execute(userData);
});

export const deleteUser = withAdminAuth(async (currentUser: User, userId: string): Promise<{ success: boolean; error?: string }> => {
  if (currentUser.id === userId) {
    return {
      success: false,
      error: 'Cannot delete your own account'
    };
  }

  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const admins = await getUsersByRoleUseCase.execute('admin');
  
  if (admins.length === 1 && admins[0].id === userId) {
    return {
      success: false,
      error: 'Cannot delete the last admin user'
    };
  }

  const deleteUserUseCase = container.get<DeleteUserUseCase>(TYPES.DeleteUserUseCase);
  return await deleteUserUseCase.execute(userId);
});