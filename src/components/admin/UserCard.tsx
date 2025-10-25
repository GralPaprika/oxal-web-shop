'use client';

import Image from 'next/image';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role?: string;
  status: string;
  lastLogin?: string;
  registeredAt?: string;
  totalOrders?: number;
}

interface UserCardProps {
  user: User;
  showRole?: boolean;
  showLastLogin?: boolean;
  showRegisteredAt?: boolean;
  showOrders?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  roleLabels?: Record<string, string>;
  statusLabels?: Record<string, string>;
  ordersLabel?: string;
}

export function UserCard({ 
  user, 
  showRole = false,
  showLastLogin = false,
  showRegisteredAt = false,
  showOrders = false,
  onEdit,
  onDelete,
  roleLabels = {},
  statusLabels = {},
  ordersLabel = 'orders'
}: UserCardProps) {
  
  const getRoleBadge = (role: string) => {
    const styles = {
      super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
      admin: 'bg-blue-100 text-blue-800 border-blue-200',
      moderator: 'bg-green-100 text-green-800 border-green-200',
      customer: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[role as keyof typeof styles] || styles.customer;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      suspended: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  const formatDate = (dateString: string) => {
    // Use a more predictable date format to avoid hydration mismatches
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      {/* User Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Image 
            src={user.avatar} 
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-text-primary">{user.name}</p>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      {showRole && user.role && (
        <td className="px-6 py-4">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadge(user.role)}`}>
            {roleLabels[user.role] || user.role}
          </span>
        </td>
      )}

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(user.status)}`}>
          {statusLabels[user.status] || user.status}
        </span>
      </td>

      {/* Last Login */}
      {showLastLogin && user.lastLogin && (
        <td className="px-6 py-4 text-sm text-text-secondary">
          {formatDate(user.lastLogin)}
        </td>
      )}

      {/* Registered At */}
      {showRegisteredAt && user.registeredAt && (
        <td className="px-6 py-4 text-sm text-text-secondary">
          {formatDate(user.registeredAt)}
        </td>
      )}

      {/* Orders */}
      {showOrders && user.totalOrders !== undefined && (
        <td className="px-6 py-4 text-sm text-text-secondary">
          {user.totalOrders} {ordersLabel}
        </td>
      )}

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(user)}
              className="p-1 text-text-secondary hover:text-amber-600 transition-colors"
              aria-label={`Edit ${user.name}`}
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(user)}
              className="p-1 text-text-secondary hover:text-red-600 transition-colors"
              aria-label={`Delete ${user.name}`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}