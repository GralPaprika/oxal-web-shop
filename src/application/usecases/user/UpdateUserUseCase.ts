import { injectable, inject } from 'inversify';
import type { IUserRepository } from '@/domain/user/user.repository';
import type { User } from '@/domain/user/user.entity';
import { TYPES } from '@/types/container.types';

export interface UpdateUserRequest {
  id: string;
  displayName?: string;
  email?: string;
  role?: 'admin' | 'cashier';
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UpdateUserResponse {
  success: boolean;
  user?: User;
  error?: string;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      this.validateUpdateRequest(request);

      const currentUser = await this.userRepository.getUserById(request.id);
      if (!currentUser) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const updateData: Partial<User> = {
        ...(request.displayName && { displayName: request.displayName }),
        ...(request.email && { email: request.email }),
        ...(request.role && { role: request.role }),
        ...(request.status && { status: request.status }),
        updatedAt: new Date().toISOString()
      };

      const result = await this.userRepository.updateUser(request.id, updateData);
      
      return {
        success: true,
        user: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      };
    }
  }

  private validateUpdateRequest(request: UpdateUserRequest): void {
    if (!request.id) {
      throw new Error('User ID is required');
    }

    if (request.email && !this.isValidEmail(request.email)) {
      throw new Error('Invalid email format');
    }

    if (request.role && !['admin', 'cashier'].includes(request.role)) {
      throw new Error('Invalid role. Must be admin or cashier');
    }

    if (request.status && !['active', 'inactive', 'suspended'].includes(request.status)) {
      throw new Error('Invalid status. Must be active, inactive, or suspended');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}