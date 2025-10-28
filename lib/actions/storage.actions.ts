'use server';

import { container } from '@/container/container.config';
import { UploadFileUseCase, DeleteFileUseCase, FileUploadData } from '@/application/usecases/storage/FileUploadUseCase';
import { TYPES } from '@/types/container.types';
import { checkAuthStatus, getCurrentUser } from '@/lib/auth';

async function verifyAdminAccess(): Promise<{ success: boolean; error?: string }> {
  try {
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return {
        success: false,
        error: 'Admin access required',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return {
      success: false,
      error: 'Failed to verify access',
    };
  }
}

function withAdminAuthOnly<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const authResult = await verifyAdminAccess();
    if (!authResult.success) {
      throw new Error(authResult.error || 'Access denied');
    }
    return fn(...args);
  };
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

// UPLOAD PRODUCT IMAGE
export const uploadProductImage = withAdminAuthOnly(async (
  formData: FormData
): Promise<UploadResult> => {
  try {
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    if (!productId) {
      return { success: false, error: 'Product ID is required' };
    }

    const uploadFileUseCase = container.get<UploadFileUseCase>(TYPES.UploadFileUseCase);
    
    const uploadData: FileUploadData = {
      file,
      folder: `products/${productId}`,
    };

    const result = await uploadFileUseCase.execute(uploadData);
    
    return {
      success: true,
      url: result.url,
      path: result.path,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
});

// DELETE PRODUCT IMAGE
export const deleteProductImage = withAdminAuthOnly(async (
  url: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!url) {
      return { success: false, error: 'URL is required' };
    }

    const deleteFileUseCase = container.get<DeleteFileUseCase>(TYPES.DeleteFileUseCase);
    await deleteFileUseCase.execute(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    };
  }
});