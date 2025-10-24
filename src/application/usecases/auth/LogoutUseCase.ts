import { injectable, inject } from 'inversify';
import type { IAuthRepository } from '@/domain/auth/auth.interface';
import { TYPES } from '@/types/container.types';

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<void> {
    try {
      await this.authRepository.signOut();
    } catch (error) {
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}