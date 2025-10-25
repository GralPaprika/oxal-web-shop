'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createUser } from '@/lib/actions/create-user.actions';

export function AddUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'user' as 'admin' | 'super_admin' | 'manager' | 'user'
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
          role: 'user'
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
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="w-4 h-4 mr-2" />
        Agregar Usuario
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Usuario</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData(prev => ({ ...prev, email: e.target.value }))
              }
              placeholder="usuario@ejemplo.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              id="displayName"
              required
              value={formData.displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData(prev => ({ ...prev, displayName: e.target.value }))
              }
              placeholder="Nombre completo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData(prev => ({ ...prev, password: e.target.value }))
              }
              placeholder="Mínimo 6 caracteres"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'super_admin' | 'manager' | 'user' }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="user">Usuario</option>
              <option value="manager">Gerente</option>
              <option value="admin">Administrador</option>
              <option value="super_admin">Super Administrador</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}