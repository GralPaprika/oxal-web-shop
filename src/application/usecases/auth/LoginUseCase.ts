import { injectable, inject } from 'inversify';
import type { IAuthRepository, LoginCredentials, AuthResult } from '@/domain/auth/auth.interface';
import { TYPES } from '@/types/container.types';

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    // Business logic validation
    this.validateCredentials(credentials);
    
    try {
      const result = await this.authRepository.signIn(credentials);
      return result;
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}