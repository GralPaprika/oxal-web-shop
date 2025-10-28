export interface IStorageService {
  uploadFile(file: File, path: string, onProgress?: UploadProgressCallback): Promise<string>;
  deleteFile(url: string): Promise<void>;
  getDownloadUrl(path: string): Promise<string>;
}

export interface UploadProgress {
  progress: number;
  isComplete: boolean;
  error?: string;
}

export type UploadProgressCallback = (progress: UploadProgress) => void;