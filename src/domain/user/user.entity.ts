export interface User {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'cashier';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  metadata?: {
    totalOrders?: number;
    lastOrderAt?: string;
    preferences?: Record<string, unknown>;
  };
}

export interface CreateUserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: 'admin' | 'cashier';
  emailVerified?: boolean;
}

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
  role?: 'admin' | 'cashier';
  status?: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  metadata?: Partial<User['metadata']>;
}