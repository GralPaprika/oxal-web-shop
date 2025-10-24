'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { container } from '@/container/container.config';
import { TYPES } from '@/types/container.types';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { LogoutUseCase } from '@/application/usecases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { AUTH_CONFIG } from '@/config/auth.config';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const loginUseCase = container.get<LoginUseCase>(TYPES.LoginUseCase);
    const result = await loginUseCase.execute({ email, password });
    
    // Set secure HTTP-only cookie with the Firebase token
    const cookieStore = await cookies();
    cookieStore.set(AUTH_CONFIG.SESSION_COOKIE_NAME, result.token, {
      ...AUTH_CONFIG.COOKIE_SETTINGS,
      maxAge: AUTH_CONFIG.COOKIE_MAX_AGE,
    });
    
    redirect(AUTH_CONFIG.ROUTES.DASHBOARD);
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}

export async function logoutAction() {
  try {
    const logoutUseCase = container.get<LogoutUseCase>(TYPES.LogoutUseCase);
    await logoutUseCase.execute();
  } catch (error) {
    // Log the logout error but don't prevent redirect
    console.error('Logout use case error:', error);
  }
  
  // Always clear the cookie and redirect, regardless of logout use case result
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_CONFIG.SESSION_COOKIE_NAME);
  
  redirect(AUTH_CONFIG.ROUTES.LOGIN);
}

export async function checkAuthStatus() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_CONFIG.SESSION_COOKIE_NAME);
  
  if (!authToken) {
    return false;
  }
  
  try {
    const getCurrentUserUseCase = container.get<GetCurrentUserUseCase>(TYPES.GetCurrentUserUseCase);
    const user = await getCurrentUserUseCase.execute();
    return !!user;
  } catch (error) {
    // If there's an error getting the user, consider them not authenticated
    return false;
  }
}