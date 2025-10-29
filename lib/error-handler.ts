/**
 * Centralized error handling utilities for consistent error logging and formatting
 */

export interface ErrorContext {
  operation?: string;
  context?: string;
  details?: Record<string, unknown>;
}

/**
 * Converts any error to a standardized Error instance
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  return new Error(JSON.stringify(error));
}

/**
 * Logs error with consistent format
 * 
 * @example
 * logError('Fetching product', error, { productId: '123' });
 * // Output: ❌ Fetching product - Error message [{"productId":"123"}]
 */
export function logError(operation: string, error: unknown, details?: Record<string, unknown>): void {
  const message = normalizeError(error).message;
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.error(`❌ ${operation} - ${message}${detailsStr}`);
}

/**
 * Wraps async functions with error handling
 * 
 * @example
 * const result = await handle(
 *   async () => await fetchProduct(id),
 *   'Fetch product',
 *   { productId: id }
 * );
 */
export async function handle<T>(
  fn: () => Promise<T>,
  operation: string,
  details?: Record<string, unknown>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(operation, error, details);
    throw normalizeError(error);
  }
}

/**
 * Wraps async functions and returns error response instead of throwing
 * Useful for server actions that need to return {success: boolean; error?: string}
 * 
 * @example
 * const result = await handleAndRespond(
 *   async () => await createProduct(data),
 *   'Create product'
 * );
 * return result; // { success: true, data: ... } or { success: false, error: '...' }
 */
export async function handleAndRespond<T extends { success: boolean; error?: string }>(
  fn: () => Promise<T>,
  operation: string,
  details?: Record<string, unknown>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(operation, error, details);
    const message = normalizeError(error).message;
    return { success: false, error: message } as T;
  }
}

/**
 * Wraps sync functions with error handling
 * 
 * @example
 * const result = handleSync(
 *   () => validateProduct(product),
 *   'Validate product'
 * );
 */
export function handleSync<T>(
  fn: () => T,
  operation: string,
  details?: Record<string, unknown>
): T {
  try {
    return fn();
  } catch (error) {
    logError(operation, error, details);
    throw normalizeError(error);
  }
}

/**
 * Formats error message for user display (non-technical)
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for common patterns
    if (error.message.includes('auth') || error.message.includes('permission')) {
      return 'You do not have permission to perform this action';
    }
    if (error.message.includes('not found')) {
      return 'The requested item was not found';
    }
    if (error.message.includes('already exists')) {
      return 'This item already exists';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
