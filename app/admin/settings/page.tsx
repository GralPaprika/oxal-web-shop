import { getTranslations } from 'next-intl/server';
import { AUTH_CONFIG } from '@/config/auth.config';
import { UsersHeader } from '@/components/admin/users';
import { SectionCard } from '@/components/admin/layout';
import { UserManagementSection } from '@/components/admin/users';
import { AddUserModal } from '@/components/admin/users';
import { getAllUsers } from '@/lib/actions/user.actions';
import type { User } from '@/domain/user/user.entity';
import { 
  UserIcon
} from '@heroicons/react/24/outline';

export default async function AdminSettings() {
  const t = await getTranslations('admin.settings');
  const breadcrumbsT = await getTranslations('admin.common.breadcrumbs');
  
  let users: User[] = [];
  let hasErrors = false;
  let errorMessage = '';

  try {
    const allUsersResult = await getAllUsers();

    if (allUsersResult.success) {
      users = allUsersResult.data?.items || [];
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
    { label: breadcrumbsT('dashboard'), href: AUTH_CONFIG.ROUTES.DASHBOARD },
    { label: breadcrumbsT('settings'), current: true }
  ];

  const userColumns = [
    { key: 'user', label: t('userManagement.table.user') },
    { key: 'role', label: t('userManagement.table.role') },
    { key: 'status', label: t('userManagement.table.status') },
    { key: 'actions', label: t('userManagement.table.actions') }
  ];

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
      <UsersHeader 
        breadcrumbs={breadcrumbs}
        showBackButton={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary">{t('title')}</h2>
          <p className="mt-2 text-text-secondary">{t('subtitle')}</p>
        </div>

        <div className="space-y-8">
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

          <SectionCard
            title={t('userManagement.title')}
            subtitle={t('userManagement.subtitle')}
            icon={UserIcon}
            rightContent={
              <AddUserModal />
            }
          >
            <UserManagementSection
              users={users}
              hasErrors={hasErrors}
              errorMessage={errorMessage}
              userColumns={userColumns}
              roleLabels={roleLabels}
              statusLabels={statusLabels}
              translations={{
                noUsersFound: t('userManagement.errors.noUsersFound'),
                unableToLoad: t('userManagement.errors.unableToLoad'),
                noUsersCreated: t('userManagement.errors.noUsersCreated'),
                createFirstUser: t('userManagement.errors.createFirstUser')
              }}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}