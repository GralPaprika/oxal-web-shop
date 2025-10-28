'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createUser } from '@/lib/actions/user.actions';

export function AddUserModal({ 
  trigger,
  children 
}: { 
  trigger?: React.ReactNode;
  children?: React.ReactNode;
} = {}) {
  const t = useTranslations('admin.settings');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'cashier' as 'admin' | 'cashier'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createUser(formData);
      
      if (result.success) {
        setOpen(false);
        setFormData({
          email: '',
          password: '',
          displayName: '',
          role: 'cashier'
        });
        window.location.reload();
      } else {
        setError(result.error || 'Failed to create user');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <div onClick={() => setOpen(true)} style={{ display: 'inline-block' }}>
        {trigger || children || (
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            {t('userManagement.newUser')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      onClick={() => setOpen(false)}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto text-left" 
        style={{ textAlign: 'left' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('userManagement.newUser')}</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left" style={{ textAlign: 'left' }}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <Input
            id="email"
            type="email"
            label={t('userManagement.form.email')}
            required
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            placeholder={t('userManagement.form.emailPlaceholder')}
          />

          <Input
            id="displayName"
            label={t('userManagement.form.displayName')}
            required
            value={formData.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData(prev => ({ ...prev, displayName: e.target.value }))
            }
            placeholder={t('userManagement.form.displayNamePlaceholder')}
          />

          <Input
            id="password"
            type="password"
            label={t('userManagement.form.password')}
            required
            minLength={6}
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData(prev => ({ ...prev, password: e.target.value }))
            }
            placeholder={t('userManagement.form.passwordPlaceholder')}
          />

          <Select
            id="role"
            label={t('userManagement.form.role')}
            value={formData.role}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'cashier' }))
            }
            options={[
              { label: t('roles.cashier'), value: 'cashier' },
              { label: t('roles.admin'), value: 'admin' }
            ]}
          />

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t('userManagement.form.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('userManagement.form.creating') : t('userManagement.form.create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}