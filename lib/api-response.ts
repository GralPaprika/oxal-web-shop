/**
 * Standard API response types for server actions
 * Ensures consistency across all server actions
 */

/**
 * Successful API response
 */
export interface ApiSuccess<T = void> {
  success: true;
  error?: never;
  data?: T extends void ? never : T;
}

/**
 * Failed API response
 */
export interface ApiError {
  success: false;
  error: string;
  data?: never;
}

/**
 * Base response type for all API operations
 * Use this to type server action returns
 * 
 * @example
 * // Simple success/error response
 * Promise<ApiResponse>
 * 
 * @example
 * // With data payload
 * Promise<ApiResponse<Product>>
 * 
 * @example
 * // With multiple fields
 * Promise<ApiResponse<{ products: Product[]; total: number }>>
 */
export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

/**
 * Helper functions to create response types
 */
export const ApiResponse = {
  /**
   * Create a success response
   * 
   * @example
   * return ApiResponse.success({ product });
   */
  success<T>(data?: T): T extends void ? ApiSuccess<void> : ApiSuccess<T> {
    if (data === undefined) {
      return { success: true } as T extends void ? ApiSuccess<void> : ApiSuccess<T>;
    }
    return { success: true, data } as T extends void ? ApiSuccess<void> : ApiSuccess<T>;
  },

  /**
   * Create an error response
   * 
   * @example
   * return ApiResponse.error('Product not found');
   */
  error(message: string): ApiError {
    return {
      success: false,
      error: message
    };
  },

  /**
   * Check if response was successful
   * 
   * @example
   * if (ApiResponse.isSuccess(response)) {
   *   console.log(response.data);
   * }
   */
  isSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
    return response.success === true;
  },

  /**
   * Check if response failed
   * 
   * @example
   * if (ApiResponse.isError(response)) {
   *   console.error(response.error);
   * }
   */
  isError(response: ApiResponse): response is ApiError {
    return response.success === false;
  }
};

/**
 * Common response types for frequently used patterns
 */
export type ApiListResponse<T> = ApiResponse<{
  items: T[];
  total: number;
}>;

export type ApiPaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;

export type ApiSingleResponse<T> = ApiResponse<T>;

