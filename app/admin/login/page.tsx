import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { checkAuthStatus } from '@/lib/auth';
import { LoginForm } from '@/components/admin/LoginForm';
import { AUTH_CONFIG } from '@/config/auth.config';

export default async function AdminLogin() {
  const t = await getTranslations('auth.login');
  
  const isAuthenticated = await checkAuthStatus();
  if (isAuthenticated) {
    redirect(AUTH_CONFIG.ROUTES.DASHBOARD);
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-amber-600 to-amber-800 relative">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-6">Oxal</h1>
            <p className="text-2xl text-amber-100">
              Panel de administración
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex items-center justify-center bg-background-primary">
        <div className="max-w-md w-full px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              {t('title')}
            </h2>
            <p className="text-text-secondary">
              {t('subtitle')}
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}