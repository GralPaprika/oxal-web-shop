import { injectable, inject } from 'inversify';
import type { IAuthRepository, User } from '@/domain/auth/auth.interface';
import { TYPES } from '@/types/container.types';

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<User | null> {
    try {
      return await this.authRepository.getCurrentUser();
    } catch (error) {
      throw new Error(`Failed to get current user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}