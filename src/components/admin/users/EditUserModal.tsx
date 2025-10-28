'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { User } from '@/domain/user/user.entity';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    id: string;
    displayName?: string;
    email?: string;
    role?: 'admin' | 'cashier';
    status?: 'active' | 'inactive' | 'suspended';
  }) => void;
}

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    role: user?.role || 'cashier' as 'admin' | 'cashier',
    status: user?.status || 'active' as 'active' | 'inactive' | 'suspended'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        role: user.role || 'cashier',
        status: user.status || 'active'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Only include changed fields
      const updates: {
        displayName?: string;
        email?: string;
        role?: 'admin' | 'cashier';
        status?: 'active' | 'inactive' | 'suspended';
      } = {};
      if (formData.displayName !== user.displayName) updates.displayName = formData.displayName;
      if (formData.email !== user.email) updates.email = formData.email;
      if (formData.role !== user.role) updates.role = formData.role;
      if (formData.status !== user.status) updates.status = formData.status;

      // Only proceed if there are actual changes
      if (Object.keys(updates).length === 0) {
        onClose();
        return;
      }

      await onSave({
        id: user.id,
        ...updates
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!user || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 text-left">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 text-left">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'cashier' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 text-left">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'suspended' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}