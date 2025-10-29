'use client';

import { useState } from 'react';
import { UserManagementTable } from './UserManagementTable';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { updateUser } from '@/lib/actions/user.actions';
import type { User } from '@/domain/user/user.entity';
import { UserIcon } from '@heroicons/react/24/outline';

interface UserManagementSectionProps {
  users: User[];
  hasErrors: boolean;
  errorMessage: string;
  userColumns: Array<{ key: string; label: string; className?: string }>;
  roleLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  // Instead of passing the function, pass the translated strings we need
  translations: {
    noUsersFound: string;
    unableToLoad: string;
    noUsersCreated: string;
    createFirstUser: string;
  };
}

export function UserManagementSection({
  users,
  hasErrors,
  errorMessage,
  userColumns,
  roleLabels,
  statusLabels,
  translations
}: UserManagementSectionProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localUsers, setLocalUsers] = useState<User[]>(users);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (userData: {
    id: string;
    displayName?: string;
    email?: string;
    role?: 'admin' | 'cashier';
    status?: 'active' | 'inactive' | 'suspended';
  }) => {
    const result = await updateUser(userData);
    
    if (result.success && result.data) {
      // Update local state with the updated user
      setLocalUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userData.id ? result.data! : user
        )
      );
    } else {
      throw new Error(result.error || 'Failed to update user');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  if (hasErrors) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error Loading Users
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{errorMessage}</p>
              <p className="mt-1">Please check Firebase configuration</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (localUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <UserIcon className="mx-auto h-12 w-12" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {translations.noUsersFound}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {hasErrors ? translations.unableToLoad : translations.noUsersCreated}
        </p>
        {!hasErrors && (
          <div className="mt-6">
            <AddUserModal>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
              <UserIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {translations.createFirstUser}
            </button>
            </AddUserModal>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <UserManagementTable
        columns={userColumns}
        data={localUsers}
        showRole={true}
        roleLabels={roleLabels}
        statusLabels={statusLabels}
        onEdit={handleEditUser}
      />
      
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveUser}
      />
    </>
  );
}