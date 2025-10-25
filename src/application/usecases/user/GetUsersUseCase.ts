import { injectable, inject } from 'inversify';
import type { IUserRepository } from '@/domain/user/user.repository';
import type { User } from '@/domain/user/user.entity';
import { TYPES } from '@/types/container.types';

@injectable()
export class GetAllUsersUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }
}

@injectable()
export class GetUsersByRoleUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(role: User['role']): Promise<User[]> {
    return await this.userRepository.getUsersByRole(role);
  }
}

@injectable()
export class GetUserByIdUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }
}