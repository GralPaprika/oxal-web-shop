export interface User {
  id: string; // Firestore document ID (same as Firebase Auth UID)
  uid: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'super_admin' | 'manager' | 'user';
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
  role?: 'admin' | 'super_admin' | 'manager' | 'user';
  emailVerified?: boolean;
}

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
  role?: 'admin' | 'super_admin' | 'manager' | 'user';
  status?: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  metadata?: Partial<User['metadata']>;
}