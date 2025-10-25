import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { checkAuthStatus } from '@/lib/auth';
import { LoginForm } from '@/components/admin/LoginForm';
import { AUTH_CONFIG } from '@/config/auth.config';

export default async function AdminLogin() {
  const t = await getTranslations('auth.login');
  
  // Check if user is already authenticated
  const isAuthenticated = await checkAuthStatus();
  if (isAuthenticated) {
    redirect(AUTH_CONFIG.ROUTES.DASHBOARD);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('title')}
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}