'use server';

import { container } from '@/container/container.config';
import { GetAllUsersUseCase, GetUsersByRoleUseCase } from '@/application/usecases/user/GetUsersUseCase';
import { UpdateUserUseCase } from '@/application/usecases/user/UpdateUserUseCase';
import { CreateUserUseCase, CreateUserRequest } from '@/application/usecases/user/CreateUserUseCase';
import { DeleteUserUseCase } from '@/application/usecases/user/DeleteUserUseCase';
import { TYPES } from '@/types/container.types';
import type { User } from '@/domain/user/user.entity';
import type { ApiListResponse, ApiSingleResponse } from '@/lib/api-response';
import { ApiResponse as Response } from '@/lib/api-response';

export async function getAllUsers(): Promise<ApiListResponse<User>> {
  const getAllUsersUseCase = container.get<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase);
  const users = await getAllUsersUseCase.execute();
  
  return Response.success({ items: users, total: users.length });
}

export async function getUsersByRole(role: User['role']): Promise<ApiListResponse<User>> {
  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const users = await getUsersByRoleUseCase.execute(role);
  
  return Response.success({ items: users, total: users.length });
}

export async function getAdminUsers(): Promise<ApiListResponse<User>> {
  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const admins = await getUsersByRoleUseCase.execute('admin');
  
  return Response.success({ items: admins, total: admins.length });
}

export async function updateUser(userData: {
  id: string;
  displayName?: string;
  email?: string;
  role?: 'admin' | 'cashier';
  status?: 'active' | 'inactive' | 'suspended';
}): Promise<ApiSingleResponse<User>> {
  const updateUserUseCase = container.get<UpdateUserUseCase>(TYPES.UpdateUserUseCase);
  const result = await updateUserUseCase.execute(userData);
  
  if (result.success) {
    return Response.success(result.user);
  }
  
  return Response.error(result.error || 'Failed to update user');
}

export async function createUser(userData: CreateUserRequest): Promise<ApiSingleResponse<User>> {
  const createUserUseCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);
  const result = await createUserUseCase.execute(userData);
  
  if (result.success) {
    return Response.success(result.user);
  }
  
  return Response.error(result.error || 'Failed to create user');
}

export async function deleteUser(userId: string): Promise<ApiSingleResponse<{ deleted: boolean }>> {
  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const admins = await getUsersByRoleUseCase.execute('admin');
  
  if (admins.length === 1 && admins[0].id === userId) {
    return Response.error('Cannot delete the last admin user');
  }

  const deleteUserUseCase = container.get<DeleteUserUseCase>(TYPES.DeleteUserUseCase);
  const result = await deleteUserUseCase.execute(userId);
  
  if (result.success) {
    return Response.success({ deleted: true });
  }
  
  return Response.error(result.error || 'Failed to delete user');
}