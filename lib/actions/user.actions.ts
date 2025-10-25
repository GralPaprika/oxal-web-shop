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
    
    // Get all admin-type users
    const [admins, superAdmins, managers] = await Promise.all([
      getUsersByRoleUseCase.execute('admin'),
      getUsersByRoleUseCase.execute('super_admin'),
      getUsersByRoleUseCase.execute('manager')
    ]);
    
    const allAdminUsers = [...admins, ...superAdmins, ...managers];
    
    return {
      success: true,
      users: allAdminUsers
    };
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return {
      success: false,
      error: 'Failed to fetch admin users'
    };
  }
}