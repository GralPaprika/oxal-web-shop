import { injectable, inject } from 'inversify';
import type { IUserRepository } from '@/domain/user/user.repository';
import { User } from '@/domain/user/user.entity';
import { TYPES } from '@/types/container.types';

export interface CreateUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'cashier';
}

export interface CreateUserResponse {
  success: boolean;
  user?: User;
  error?: string;
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      // Validate input
      if (!request.email || !request.password || !request.displayName) {
        return {
          success: false,
          error: 'Email, password, and display name are required'
        };
      }

      if (request.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
      }

      // Create user (this will handle both Firebase Auth and Firestore)
      const user = await this.userRepository.createUser({
        email: request.email,
        password: request.password,
        displayName: request.displayName,
        role: request.role
      });

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle specific Firebase errors
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          return {
            success: false,
            error: 'This email is already registered'
          };
        }
        if (error.message.includes('weak-password')) {
          return {
            success: false,
            error: 'Password is too weak'
          };
        }
        if (error.message.includes('invalid-email')) {
          return {
            success: false,
            error: 'Invalid email format'
          };
        }
      }

      return {
        success: false,
        error: 'Failed to create user. Please try again.'
      };
    }
  }
}