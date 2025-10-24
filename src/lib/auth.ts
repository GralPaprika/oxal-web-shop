'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // TODO: Replace with actual authentication logic
  if (email === 'admin@example.com' && password === 'admin123') {
    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    redirect('/admin/dashboard');
  } else {
    return { error: 'Invalid credentials' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}

export async function checkAuthStatus() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('admin_token');
  return !!authToken;
}