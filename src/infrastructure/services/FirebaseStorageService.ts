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
import type { IFirebaseService } from '@/src/infrastructure/firebase.interface';
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
      const storageRef: StorageReference = ref(this.storage, path);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            if (onProgress) {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress({
                progress,
                isComplete: false,
              });
            }
          },
          (error) => {
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
      const oIndex = url.indexOf('/o/');
      if (oIndex === -1) {
        throw new Error('Invalid Firebase Storage URL format');
      }
      
      const pathStart = oIndex + 3; // Length of '/o/'
      const queryIndex = url.indexOf('?', pathStart);
      const encodedPath = queryIndex === -1 ? url.substring(pathStart) : url.substring(pathStart, queryIndex);
      
      const path = decodeURIComponent(encodedPath);
      
      console.log(`Deleting file from path: ${path}`);
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
      console.log(`Successfully deleted file: ${path}`);
    } catch (error) {
      console.error('Error deleting file from Firebase:', error);
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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