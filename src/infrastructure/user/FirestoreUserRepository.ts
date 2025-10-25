import { injectable, inject } from 'inversify';
import type { IUserRepository } from '@/domain/user/user.repository';
import type { User } from '@/domain/user/user.entity';
import type { CreateUserData } from '@/domain/user/user.repository';
import type { IDatabase } from '@/database/database.interface';
import { TYPES } from '@/types/container.types';
import { FirebaseUserService } from './FirebaseUserService';

@injectable()
export class FirestoreUserRepository implements IUserRepository {
  private readonly COLLECTION_NAME = 'users';
  private firebaseUserService: FirebaseUserService;

  constructor(
    @inject(TYPES.Database) private database: IDatabase
  ) {
    this.firebaseUserService = new FirebaseUserService();
  }

  async createUser(userData: CreateUserData): Promise<User> {
    // Use FirebaseUserService to create user with authentication
    return await this.firebaseUserService.createUserWithAuth(userData);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.database.getAll<User>(this.COLLECTION_NAME);
  }

  async getUsersByRole(role: 'admin' | 'super_admin' | 'manager' | 'user'): Promise<User[]> {
    return await this.database.query<User>(this.COLLECTION_NAME, 'role', '==', role);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.database.getById<User>(this.COLLECTION_NAME, id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.database.query<User>(this.COLLECTION_NAME, 'email', '==', email);
    return users.length > 0 ? users[0] : null;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    await this.database.update<User>(this.COLLECTION_NAME, id, updateData);
    
    // Return the updated user
    const updatedUser = await this.getUserById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.database.delete(this.COLLECTION_NAME, id);
  }
}