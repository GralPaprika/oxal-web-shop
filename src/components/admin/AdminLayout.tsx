'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AdminLayout({ children, requireAuth = true }: AdminLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    if (requireAuth) {
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/admin/login');
      }
    }
  }, [requireAuth, router]);

  return <>{children}</>;
}