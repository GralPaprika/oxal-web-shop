import { User } from './user.entity';

export interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'cashier';
}

export interface IUserRepository {
  createUser(data: CreateUserData): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: 'admin' | 'cashier'): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}