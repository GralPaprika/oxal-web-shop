import { injectable, inject } from 'inversify';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  UploadTaskSnapshot,
  StorageReference
} from 'firebase/storage';
import { IStorageService, UploadProgressCallback } from '@/domain/storage/storage.interface';
import type { IFirebaseService } from '@/infrastructure/firebase/firebase.interface';
import { TYPES } from '@/types/container.types';

@injectable()
export class FirebaseStorageService implements IStorageService {
  private storage;

  constructor(@inject(TYPES.FirebaseService) private firebaseService: IFirebaseService) {
    this.storage = this.firebaseService.getStorage();
  }

  async uploadFile(
    file: File, 
    path: string, 
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    try {
      // Create a storage reference
      const storageRef: StorageReference = ref(this.storage, path);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            // Progress callback
            if (onProgress) {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress({
                progress,
                isComplete: false,
              });
            }
          },
          (error) => {
            // Error callback
            console.error('Upload error:', error);
            if (onProgress) {
              onProgress({
                progress: 0,
                isComplete: false,
                error: error.message,
              });
            }
            reject(new Error(`Upload failed: ${error.message}`));
          },
          async () => {
            // Success callback
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              if (onProgress) {
                onProgress({
                  progress: 100,
                  isComplete: true,
                });
              }
              resolve(downloadURL);
            } catch (downloadError) {
              console.error('Error getting download URL:', downloadError);
              reject(new Error('Failed to get download URL'));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error starting upload:', error);
      throw new Error('Failed to start file upload');
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      // Extract the path from the Firebase Storage URL
      const urlParts = url.split('/');
      const pathIndex = urlParts.findIndex(part => part.includes('o'));
      if (pathIndex === -1) {
        throw new Error('Invalid Firebase Storage URL');
      }
      
      const encodedPath = urlParts[pathIndex + 1];
      const path = decodeURIComponent(encodedPath.split('?')[0]);
      
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getDownloadUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error('Failed to get download URL');
    }
  }
}