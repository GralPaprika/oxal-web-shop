'use server';

import { container } from '@/container/container.config';
import { GetAllUsersUseCase, GetUsersByRoleUseCase } from '@/application/usecases/user/GetUsersUseCase';
import { TYPES } from '@/types/container.types';
import type { User } from '@/domain/user/user.entity';

export async function getAllUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
  try {
    const getAllUsersUseCase = container.get<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase);
    const users = await getAllUsersUseCase.execute();
    
    return {
      success: true,
      users
    };
  } catch (error) {
    console.error('Error fetching all users:', error);
    return {
      success: false,
      error: 'Failed to fetch users'
    };
  }
}

export async function getUsersByRole(role: User['role']): Promise<{ success: boolean; users?: User[]; error?: string }> {
  try {
    const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
    const users = await getUsersByRoleUseCase.execute(role);
    
    return {
      success: true,
      users
    };
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return {
      success: false,
      error: 'Failed to fetch users'
    };
  }
}

export async function getAdminUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
  try {
    const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
    
    // Get all admin users
    const admins = await getUsersByRoleUseCase.execute('admin');
    
    return {
      success: true,
      users: admins
    };
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return {
      success: false,
      error: 'Failed to fetch admin users'
    };
  }
}