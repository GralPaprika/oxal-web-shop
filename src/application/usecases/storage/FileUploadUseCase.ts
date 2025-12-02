import { injectable, inject } from 'inversify';
import type { IStorageService } from '@/domain/storage/storage.interface';
import { UploadProgressCallback } from '@/domain/storage/storage.interface';
import { TYPES } from '@/types/container.types';

export interface FileUploadData {
  file: File;
  folder: string;
  fileName?: string;
}

export interface FileUploadResult {
  url: string;
  path: string;
}

@injectable()
export class UploadFileUseCase {
  constructor(
    @inject(TYPES.StorageService) private storageService: IStorageService
  ) {}

  async execute(
    data: FileUploadData,
    onProgress?: UploadProgressCallback
  ): Promise<FileUploadResult> {
    this.validateFile(data.file);

    const fileName = data.fileName || this.generateFileName(data.file);
    
    const path = `${data.folder}/${fileName}`;

    try {
      const url = await this.storageService.uploadFile(data.file, path, onProgress);
      
      return {
        url,
        path,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  private validateFile(file: File): void {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
  }

  private generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  }
}

@injectable()
export class DeleteFileUseCase {
  constructor(
    @inject(TYPES.StorageService) private storageService: IStorageService
  ) {}

  async execute(url: string): Promise<void> {
    try {
      await this.storageService.deleteFile(url);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }
}