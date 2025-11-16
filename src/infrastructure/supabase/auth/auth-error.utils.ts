/**
 * Supabase Authentication Error Utilities
 * Handles authentication error translation and logging
 */

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function translateAuthError(error: unknown): AuthError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
      return new AuthError('INVALID_CREDENTIALS', 'Invalid email or password', error);
    }

    if (message.includes('user already registered')) {
      return new AuthError('USER_EXISTS', 'Email already registered', error);
    }

    if (message.includes('email not confirmed')) {
      return new AuthError('EMAIL_NOT_CONFIRMED', 'Please verify your email', error);
    }

    if (message.includes('over request rate limit')) {
      return new AuthError('RATE_LIMITED', 'Too many requests. Please try again later', error);
    }

    if (message.includes('network error') || message.includes('failed to fetch')) {
      return new AuthError('NETWORK_ERROR', 'Network error. Please check your connection', error);
    }

    return new AuthError('AUTH_ERROR', error.message, error);
  }

  return new AuthError('UNKNOWN_ERROR', 'An unknown authentication error occurred', error);
}
