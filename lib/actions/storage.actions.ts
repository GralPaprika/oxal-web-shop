'use server';

import { container } from '@/container/container.config';
import { UploadFileUseCase, DeleteFileUseCase, FileUploadData } from '@/application/usecases/storage/FileUploadUseCase';
import { TYPES } from '@/types/container.types';
import { withAdminAuthOnly } from '@/lib/auth-wrapper';
import { handleAndRespond } from '@/lib/error-handler';

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
  return handleAndRespond(
    async () => {
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
    },
    'Upload product image',
    { productId: formData.get('productId') }
  );
});

// DELETE PRODUCT IMAGE
export const deleteProductImage = withAdminAuthOnly(async (
  url: string
): Promise<{ success: boolean; error?: string }> => {
  return handleAndRespond(
    async () => {
      if (!url) {
        return { success: false, error: 'URL is required' };
      }

      const deleteFileUseCase = container.get<DeleteFileUseCase>(TYPES.DeleteFileUseCase);
      await deleteFileUseCase.execute(url);
      
      return { success: true };
    },
    'Delete product image',
    { url }
  );
});