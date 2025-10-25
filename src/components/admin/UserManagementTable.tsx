'use client';

import { DataTable } from '@/components/admin/DataTable';
import { UserCard } from '@/components/admin/UserCard';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  status: string;
  lastLogin?: string;
  registeredAt?: string;
  totalOrders?: number;
  avatar: string;
}

interface UserManagementTableProps {
  data: User[];
  columns: Array<{ key: string; label: string; className?: string }>;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  showRole?: boolean;
  showLastLogin?: boolean;
  showRegisteredAt?: boolean;
  showOrders?: boolean;
  roleLabels?: Record<string, string>;
  statusLabels?: Record<string, string>;
  ordersLabel?: string;
}

export function UserManagementTable({
  data,
  columns,
  onEdit,
  onDelete,
  showRole = false,
  showLastLogin = false,
  showRegisteredAt = false,
  showOrders = false,
  roleLabels = {},
  statusLabels = {},
  ordersLabel = 'orders'
}: UserManagementTableProps) {
  
  const handleEdit = (user: User) => {
    if (onEdit) {
      onEdit(user);
    } else {
      // Default behavior - TODO: Implement edit functionality
      console.log('Edit user:', user);
    }
  };

  const handleDelete = (user: User) => {
    if (onDelete) {
      onDelete(user);
    } else {
      // Default behavior - TODO: Implement delete functionality
      console.log('Delete user:', user);
    }
  };

  return (
    <DataTable columns={columns}>
      {data.map((user: User) => (
        <UserCard
          key={user.id}
          user={user}
          showRole={showRole}
          showLastLogin={showLastLogin}
          showRegisteredAt={showRegisteredAt}
          showOrders={showOrders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          roleLabels={roleLabels}
          statusLabels={statusLabels}
          ordersLabel={ordersLabel}
        />
      ))}
    </DataTable>
  );
}