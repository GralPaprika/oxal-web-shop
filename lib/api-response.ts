export interface ApiSuccess<T = void> {
  success: true;
  error?: never;
  data?: T extends void ? never : T;
}

export interface ApiError {
  success: false;
  error: string;
  data?: never;
}

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

export const ApiResponse = {
  success<T>(data?: T): T extends void ? ApiSuccess<void> : ApiSuccess<T> {
    if (data === undefined) {
      return { success: true } as T extends void ? ApiSuccess<void> : ApiSuccess<T>;
    }
    return { success: true, data } as T extends void ? ApiSuccess<void> : ApiSuccess<T>;
  },

  error(message: string): ApiError {
    return {
      success: false,
      error: message
    };
  },

  isSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
    return response.success === true;
  },

  isError(response: ApiResponse): response is ApiError {
    return response.success === false;
  }
};

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

