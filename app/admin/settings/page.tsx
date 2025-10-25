import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { checkAuthStatus } from '@/lib/auth';
import { AUTH_CONFIG } from '@/config/auth.config';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SectionCard } from '@/components/admin/SectionCard';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { SettingsActions } from '@/components/admin/SettingsActions';
import { SectionActions } from '@/components/admin/SectionActions';
import { 
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Mock data - in real app this would come from database
const mockAdmins = [
  {
    id: 1,
    name: 'Carlos Admin',
    email: 'carlos@oxal.com',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2025-10-25T10:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria@oxal.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-10-24T16:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612345b?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Juan Pérez',
    email: 'juan@oxal.com',
    role: 'moderator',
    status: 'inactive',
    lastLogin: '2025-10-20T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  }
];

const mockUsers = [
  {
    id: 1,
    name: 'Ana Cliente',
    email: 'ana@email.com',
    role: 'customer',
    status: 'active',
    registeredAt: '2025-09-15T14:20:00Z',
    totalOrders: 12,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Pedro Martín',
    email: 'pedro@email.com',
    role: 'customer',
    status: 'active',
    registeredAt: '2025-08-20T11:30:00Z',
    totalOrders: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  }
];

export default async function AdminSettings() {
  const t = await getTranslations('admin.settings');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  // Check authentication status - same as dashboard would have
  const isAuthenticated = await checkAuthStatus();
  if (!isAuthenticated) {
    redirect(AUTH_CONFIG.ROUTES.LOGIN);
  }

  const breadcrumbs = [
    { label: breadcrumbsT('dashboard'), href: '/admin/dashboard' },
    { label: breadcrumbsT('settings'), current: true }
  ];

  const rightContent = (
    <SettingsActions
      changePasswordLabel={t('changePassword')}
      newAdminLabel={t('newAdmin')}
    />
  );

  // Define table columns
  const adminColumns = [
    { key: 'admin', label: t('adminManagement.table.admin') },
    { key: 'role', label: t('adminManagement.table.role') },
    { key: 'status', label: t('adminManagement.table.status') },
    { key: 'lastLogin', label: t('adminManagement.table.lastLogin') },
    { key: 'actions', label: t('adminManagement.table.actions') }
  ];

  const userColumns = [
    { key: 'user', label: t('userManagement.table.user') },
    { key: 'status', label: t('userManagement.table.status') },
    { key: 'registered', label: t('userManagement.table.registered') },
    { key: 'orders', label: t('userManagement.table.orders') },
    { key: 'actions', label: t('userManagement.table.actions') }
  ];

  // Role and status labels
  const roleLabels = {
    super_admin: t('roles.super_admin'),
    admin: t('roles.admin'),
    moderator: t('roles.moderator'),
    customer: t('roles.customer')
  };

  const statusLabels = {
    active: t('status.active'),
    inactive: t('status.inactive'),
    suspended: t('status.suspended')
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <AdminHeader 
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        rightContent={rightContent}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary">{t('title')}</h2>
          <p className="mt-2 text-text-secondary">{t('subtitle')}</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Admin Management */}
          <SectionCard
            title={t('adminManagement.title')}
            subtitle={t('adminManagement.subtitle')}
            icon={ShieldCheckIcon}
            rightContent={
              <SectionActions
                label={t('adminManagement.newAdmin')}
              />
            }
          >
            <UserManagementTable
              columns={adminColumns}
              data={mockAdmins}
              showRole={true}
              showLastLogin={true}
              roleLabels={roleLabels}
              statusLabels={statusLabels}
            />
          </SectionCard>

          {/* User Management */}
          <SectionCard
            title={t('userManagement.title')}
            subtitle={t('userManagement.subtitle')}
            icon={UserIcon}
            rightContent={
              <SectionActions
                label={t('userManagement.newUser')}
                variant="outline"
              />
            }
          >
            <UserManagementTable
              columns={userColumns}
              data={mockUsers}
              showRegisteredAt={true}
              showOrders={true}
              statusLabels={statusLabels}
              ordersLabel={t('userManagement.ordersLabel')}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}