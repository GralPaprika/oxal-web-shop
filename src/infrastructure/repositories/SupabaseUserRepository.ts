import { injectable, inject } from 'inversify';
import { User } from '@/domain/user/user.entity';
import { CreateUserData, IUserRepository } from '@/domain/user/user.repository';
import { TYPES } from '@/types/container.types';
import type { IDrizzleService } from '@/src/infrastructure/supabase/drizzle.interface';

@injectable()
export class SupabaseUserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.DrizzleService) private drizzleService: IDrizzleService
  ) {}

  private formatDateToISO(date: Date): string {
    return date.toISOString();
  }

  async createUser(data: CreateUserData): Promise<User> {
    const newUser: User = {
      id: '',
      uid: '',
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      status: 'active',
      emailVerified: false,
      createdAt: this.formatDateToISO(new Date()),
      updatedAt: this.formatDateToISO(new Date()),
    };

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUsersByRole(_role: 'admin' | 'cashier'): Promise<User[]> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserById(_id: string): Promise<User | null> {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserByEmail(_email: string): Promise<User | null> {
    return null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const updatedUser: User = {
      id,
      uid: '',
      email: '',
      role: 'cashier',
      status: 'active',
      emailVerified: false,
      createdAt: '',
      updatedAt: this.formatDateToISO(new Date()),
      ...data,
    };
    return updatedUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteUser(_id: string): Promise<void> {
    return;
  }
}
