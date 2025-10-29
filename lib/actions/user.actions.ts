'use server';

import { container } from '@/container/container.config';
import { GetAllUsersUseCase, GetUsersByRoleUseCase } from '@/application/usecases/user/GetUsersUseCase';
import { UpdateUserUseCase } from '@/application/usecases/user/UpdateUserUseCase';
import { CreateUserUseCase, CreateUserRequest } from '@/application/usecases/user/CreateUserUseCase';
import { DeleteUserUseCase } from '@/application/usecases/user/DeleteUserUseCase';
import { TYPES } from '@/types/container.types';
import type { User } from '@/domain/user/user.entity';
import { withAdminAuthOnly, withAdminAuth } from '@/lib/auth-wrapper';
import type { ApiListResponse, ApiSingleResponse } from '@/lib/api-response';
import { ApiResponse as Response } from '@/lib/api-response';

export const getAllUsers = withAdminAuthOnly(async (): Promise<ApiListResponse<User>> => {
  const getAllUsersUseCase = container.get<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase);
  const users = await getAllUsersUseCase.execute();
  
  return Response.success({ items: users, total: users.length });
});

export const getUsersByRole = withAdminAuthOnly(async (role: User['role']): Promise<ApiListResponse<User>> => {
  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const users = await getUsersByRoleUseCase.execute(role);
  
  return Response.success({ items: users, total: users.length });
});

export const getAdminUsers = withAdminAuthOnly(async (): Promise<ApiListResponse<User>> => {
  const getUsersByRoleUseCase = container.get<GetUsersByRoleUseCase>(TYPES.GetUsersByRoleUseCase);
  const admins = await getUsersByRoleUseCase.execute('admin');
  
  return Response.success({ items: admins, total: admins.length });
});

export const updateUser = withAdminAuth(async (currentUser: User, userData: {
  id: string;
  displayName?: string;
  email?: string;
  role?: 'admin' | 'cashier';
  status?: 'active' | 'inactive' | 'suspended';
}): Promise<ApiSingleResponse<User>> => {
  if (currentUser.id === userData.id && userData.role && userData.role !== 'admin') {
    return Response.error('Cannot remove admin privileges from your own account');
  }

  if (currentUser.id === userData.id && userData.status && userData.status !== 'active') {
    return Response.error('Cannot change status of your own account');
  }

  const updateUserUseCase = container.get<UpdateUserUseCase>(TYPES.UpdateUserUseCase);
  const result = await updateUserUseCase.execute(userData);
  
  if (result.success) {
    return Response.success(result.user);
  }
  
  return Response.error(result.error || 'Failed to update user');
});

export const createUser = withAdminAuth(async (currentUser: User, userData: CreateUserRequest): Promise<ApiSingleResponse<User>> => {
  const createUserUseCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);
  const result = await createUserUseCase.execute(userData);
  
  if (result.success) {
    return Response.success(result.user);
  }
  
  return Response.error(result.error || 'Failed to create user');
});

export const deleteUser = withAdminAuth(async (currentUser: User, userId: string): Promise<ApiSingleResponse<{ deleted: boolean }>> => {
  if (currentUser.id === userId) {
    return Response.error('Cannot delete your own account');
  }

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
});