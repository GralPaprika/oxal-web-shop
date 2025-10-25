import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { checkAuthStatus } from '@/lib/auth';
import { AUTH_CONFIG } from '@/config/auth.config';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SectionCard } from '@/components/admin/SectionCard';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { SettingsActions } from '@/components/admin/SettingsActions';
import { SectionActions } from '@/components/admin/SectionActions';
import { AddUserModal } from '@/components/admin/AddUserModal';
import { getAdminUsers, getAllUsers } from '@/lib/actions/user.actions';
import type { User } from '@/domain/user/user.entity';
import { 
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default async function AdminSettings() {
  const t = await getTranslations('admin.settings');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  // Check authentication status - same as dashboard would have
  const isAuthenticated = await checkAuthStatus();
  if (!isAuthenticated) {
    redirect(AUTH_CONFIG.ROUTES.LOGIN);
  }

  // Initialize empty arrays for users and admins
  let admins: User[] = [];
  let users: User[] = [];
  let hasErrors = false;
  let errorMessage = '';

  try {
    // Fetch real data from Firebase
    const [adminUsersResult, allUsersResult] = await Promise.all([
      getAdminUsers(),
      getAllUsers()
    ]);

    // Handle admin users result
    if (adminUsersResult.success) {
      admins = adminUsersResult.users || [];
    } else {
      console.error('Failed to fetch admin users:', adminUsersResult.error);
      hasErrors = true;
      errorMessage = adminUsersResult.error || 'Failed to fetch admin users';
    }

    // Handle all users result
    if (allUsersResult.success) {
      users = (allUsersResult.users || []).filter((user: User) => user.role === 'user');
    } else {
      console.error('Failed to fetch users:', allUsersResult.error);
      hasErrors = true;
      errorMessage = allUsersResult.error || 'Failed to fetch users';
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    hasErrors = true;
    errorMessage = 'Failed to connect to database';
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
          {/* Error Display */}
          {hasErrors && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading user data
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                    <p className="mt-1">Please check your Firebase configuration and ensure Firestore is properly set up.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            {admins.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <ShieldCheckIcon className="mx-auto h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No admin users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {hasErrors ? 'Unable to load admin users due to an error.' : 'No admin users have been created yet.'}
                </p>
                {!hasErrors && (
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <ShieldCheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Create first admin
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <UserManagementTable
                columns={adminColumns}
                data={admins}
                showRole={true}
                showLastLogin={true}
                roleLabels={roleLabels}
                statusLabels={statusLabels}
              />
            )}
          </SectionCard>

          {/* User Management */}
          <SectionCard
            title={t('userManagement.title')}
            subtitle={t('userManagement.subtitle')}
            icon={UserIcon}
            rightContent={
              <AddUserModal />
            }
          >
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <UserIcon className="mx-auto h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {hasErrors ? 'Unable to load users due to an error.' : 'No users have registered yet.'}
                </p>
              </div>
            ) : (
              <UserManagementTable
                columns={userColumns}
                data={users}
                showRegisteredAt={true}
                showOrders={true}
                statusLabels={statusLabels}
                ordersLabel={t('userManagement.ordersLabel')}
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}