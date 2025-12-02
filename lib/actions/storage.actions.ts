'use server';

import { container } from '@/container/container.config';
import { UploadFileUseCase, DeleteFileUseCase, FileUploadData } from '@/application/usecases/storage/FileUploadUseCase';
import { TYPES } from '@/types/container.types';
import type { ApiResponse } from '@/lib/api-response';
import { ApiResponse as Response } from '@/lib/api-response';

export async function uploadProductImage(
  formData: FormData
): Promise<ApiResponse<{ url: string; path: string }>> {
  try {
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
  } catch (error) {
    console.error('Error uploading product image:', error);
    return Response.error('Failed to upload product image');
  }
}

export async function deleteProductImage(
  url: string
): Promise<ApiResponse> {
  try {
    if (!url) {
        return Response.error('URL is required');
      }

      const deleteFileUseCase = container.get<DeleteFileUseCase>(TYPES.DeleteFileUseCase);
      await deleteFileUseCase.execute(url);
      
      return Response.success();
  } catch (error) {
    console.error('Error deleting product image:', error);
    return Response.error('Failed to delete product image');
  }
}