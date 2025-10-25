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
    <form action={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder={t('email')}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            {t('password')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder={t('password')}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}

      <div>
        <Button
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          className="w-full"
        >
          {isPending ? t('signingIn') : t('signIn')}
        </Button>
      </div>
    </form>
  );
}