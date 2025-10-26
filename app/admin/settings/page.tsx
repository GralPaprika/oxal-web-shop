import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { checkAuthStatus } from '@/lib/auth';
import { AUTH_CONFIG } from '@/config/auth.config';
import { UsersHeader } from '@/src/components/admin/UsersHeader';
import { SectionCard } from '@/components/admin/SectionCard';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { AddUserModal } from '@/components/admin/AddUserModal';
import { getAllUsers } from '@/lib/actions/user.actions';
import type { User } from '@/domain/user/user.entity';
import { 
  UserIcon
} from '@heroicons/react/24/outline';

export default async function AdminSettings() {
  const t = await getTranslations('admin.settings');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  // Check authentication status - same as dashboard would have
  const isAuthenticated = await checkAuthStatus();
  if (!isAuthenticated) {
    redirect(AUTH_CONFIG.ROUTES.LOGIN);
  }

  // Initialize empty array for users
  let users: User[] = [];
  let hasErrors = false;
  let errorMessage = '';

  try {
    // Fetch all users from Firebase
    const allUsersResult = await getAllUsers();

    // Handle all users result
    if (allUsersResult.success) {
      users = allUsersResult.users || [];
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

  // Define table columns (keep the admin columns structure)
  const userColumns = [
    { key: 'user', label: t('userManagement.table.user') },
    { key: 'role', label: t('userManagement.table.role') },
    { key: 'status', label: t('userManagement.table.status') },
    { key: 'lastLogin', label: t('userManagement.table.lastLogin') },
    { key: 'actions', label: t('userManagement.table.actions') }
  ];

  // Role and status labels
  const roleLabels = {
    admin: t('roles.admin'),
    cashier: t('roles.cashier')
  };

  const statusLabels = {
    active: t('status.active'),
    inactive: t('status.inactive'),
    suspended: t('status.suspended')
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <UsersHeader 
        breadcrumbs={breadcrumbs}
        showBackButton={true}
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
                    {t('userManagement.errors.loadingTitle')}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                    <p className="mt-1">{t('userManagement.errors.checkFirebase')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('userManagement.errors.noUsersFound')}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {hasErrors ? t('userManagement.errors.unableToLoad') : t('userManagement.errors.noUsersCreated')}
                </p>
                {!hasErrors && (
                  <div className="mt-6">
                    <AddUserModal>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      >
                        <UserIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {t('userManagement.errors.createFirstUser')}
                      </button>
                    </AddUserModal>
                  </div>
                )}
              </div>
            ) : (
              <UserManagementTable
                columns={userColumns}
                data={users}
                showRole={true}
                showLastLogin={true}
                roleLabels={roleLabels}
                statusLabels={statusLabels}
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}