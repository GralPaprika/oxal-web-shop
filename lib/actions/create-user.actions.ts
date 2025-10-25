'use server';

import { container } from '@/container/container.config';
import { TYPES } from '@/types/container.types';
import { CreateUserUseCase, CreateUserRequest } from '@/application/user/CreateUserUseCase';

export async function createUser(userData: CreateUserRequest) {
  try {
    const createUserUseCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);
    return await createUserUseCase.execute(userData);
  } catch (error) {
    console.error('Error in createUser action:', error);
    return {
      success: false,
      error: 'Failed to create user. Please try again.'
    };
  }
}