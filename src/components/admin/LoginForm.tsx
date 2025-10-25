'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { loginAction } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError('');
    
    try {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError(t('loginFailed'));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-text-primary placeholder-text-muted"
            placeholder="tu@ejemplo.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
            {t('password')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-text-primary placeholder-text-muted"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        isLoading={isPending}
        className="w-full py-3 text-base font-semibold"
      >
        {isPending ? t('signingIn') : t('signIn')}
      </Button>

      <div className="text-center">
        <a href="#" className="text-sm text-amber-600 hover:text-amber-700 transition-colors">
          {t('forgotPassword')}
        </a>
      </div>
    </form>
  );
}