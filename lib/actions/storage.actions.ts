'use server';

import { container } from '@/container/container.config';
import { UploadFileUseCase, DeleteFileUseCase, FileUploadData } from '@/application/usecases/storage/FileUploadUseCase';
import { TYPES } from '@/types/container.types';
import { handleAndRespond } from '@/lib/error-handler';
import type { ApiResponse } from '@/lib/api-response';
import { ApiResponse as Response } from '@/lib/api-response';

/**
 * Storage Server Actions
 *
 * Auth is handled by middleware (auth.middleware.ts protects /admin/* routes)
 * These actions assume the caller is already authenticated and admin
 */

// UPLOAD PRODUCT IMAGE
export async function uploadProductImage(
  formData: FormData
): Promise<ApiResponse<{ url: string; path: string }>> {
  return handleAndRespond(
    async () => {
      const file = formData.get('file') as File;
      const productId = formData.get('productId') as string;
      
      if (!file) {
        return Response.error('No file provided');
      }

      if (!productId) {
        return Response.error('Product ID is required');
      }

      const uploadFileUseCase = container.get<UploadFileUseCase>(TYPES.UploadFileUseCase);
      
      const uploadData: FileUploadData = {
        file,
        folder: `products/${productId}`,
      };

      const result = await uploadFileUseCase.execute(uploadData);
      
      return Response.success({ url: result.url, path: result.path });
    },
    'Upload product image',
    { productId: formData.get('productId') }
  );
}

// DELETE PRODUCT IMAGE
export async function deleteProductImage(
  url: string
): Promise<ApiResponse> {
  return handleAndRespond(
    async () => {
      if (!url) {
        return Response.error('URL is required');
      }

      const deleteFileUseCase = container.get<DeleteFileUseCase>(TYPES.DeleteFileUseCase);
      await deleteFileUseCase.execute(url);
      
      return Response.success();
    },
    'Delete product image',
    { url }
  );
}