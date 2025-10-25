import { getTranslations } from 'next-intl/server';
import { logoutAction } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export default async function AdminDashboard() {
  const t = await getTranslations('auth.dashboard');
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              {t('logout')}
            </Button>
          </form>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">
            {t('welcome')}
          </p>
        </div>
      </div>
    </div>
  );
}