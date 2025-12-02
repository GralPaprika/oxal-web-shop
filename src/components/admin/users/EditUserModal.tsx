'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
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
  const t = useTranslations('admin.settings');
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    role: user?.role || 'cashier' as 'admin' | 'cashier',
    status: user?.status || 'active' as 'active' | 'inactive' | 'suspended'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <h2 className="text-xl font-semibold text-gray-900">{t('userManagement.editUser') ?? 'Edit User'}</h2>
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

          <Input
            type="text"
            id="displayName"
            label={t('userManagement.form.displayName')}
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            required
          />

          <Input
            type="email"
            id="email"
            label={t('userManagement.form.email')}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Select
            id="role"
            label={t('userManagement.form.role')}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'cashier' })}
            options={[
              { label: t('roles.cashier'), value: 'cashier' },
              { label: t('roles.admin'), value: 'admin' }
            ]}
          />

          <Select
            id="status"
            label={t('userManagement.table.status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'suspended' })}
            options={[
              { label: t('status.active'), value: 'active' },
              { label: t('status.inactive'), value: 'inactive' },
              { label: t('status.suspended'), value: 'suspended' }
            ]}
          />

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t('userManagement.form.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (t('userManagement.form.saving') ?? 'Saving...') : (t('userManagement.form.save') ?? 'Save Changes')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}