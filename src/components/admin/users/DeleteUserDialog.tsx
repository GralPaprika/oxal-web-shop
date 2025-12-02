 'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { TrashIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { deleteUser } from '@/lib/actions/user.actions';
import type { User } from '@/domain/user/user.entity';
import Image from 'next/image';

interface DeleteUserDialogProps {
  user: User;
  onDelete?: () => void;
  trigger?: React.ReactNode;
}

export function DeleteUserDialog({ user, onDelete, trigger }: DeleteUserDialogProps) {
  const t = useTranslations('admin.settings');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteUser(user.id);
      
      if (result.success) {
        setOpen(false);
        onDelete?.();
        window.location.reload();
      } else {
        setError(result.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Delete user error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      )}

      {open && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
          onClick={handleClickOutside}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                      {t('userManagement.deleteDialog.title') ?? 'Delete User'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t('userManagement.deleteDialog.message') ?? 'This action cannot be undone'}
                    </p>
                </div>
              </div>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700">
                  {t('userManagement.deleteDialog.confirmation', {
                    name: user.displayName || user.email,
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {t('userManagement.deleteDialog.detail') ?? 'This will permanently remove the user account and all associated data.'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium text-sm">
                        {(user.displayName || user.email).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.displayName || 'No display name'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {user.role} • {user.status}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                disabled={loading}
              >
                {t('userManagement.deleteDialog.cancelButton') ?? 'Cancel'}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('userManagement.deleteDialog.deleting') ?? 'Deleting...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <TrashIcon className="w-4 h-4" />
                    <span>{t('userManagement.deleteDialog.confirmButton') ?? 'Delete User'}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}