import { injectable, inject } from 'inversify';
import type { IUserRepository } from '@/domain/user/user.repository';
import { TYPES } from '@/types/container.types';

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.userRepository.deleteUser(userId);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error in DeleteUserUseCase:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  }
}