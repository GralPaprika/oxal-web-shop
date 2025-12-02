import { useState, useCallback } from 'react';

export interface UploadProgress {
  fileName: string;
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export interface UseFileUploadOptions {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  maxFileSizeBytes?: number; // in bytes
  allowedTypes?: string[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  
  const {
    onUploadComplete,
    onUploadError,
    maxFileSizeBytes: maxFileSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  } = options;

  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize) {
      return `File size too large. Maximum size: ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB`;
    }
    
    return null;
  }, [allowedTypes, maxFileSize]);

  const resetUpload = useCallback(() => {
    setUploadProgress(null);
  }, []);

  const updateProgress = useCallback((fileName: string, progress: number) => {
    setUploadProgress(prev => prev ? { ...prev, progress } : null);
  }, []);

  const setError = useCallback((error: string) => {
    setUploadProgress(prev => 
      prev ? { ...prev, error, isUploading: false } : null
    );
    onUploadError?.(error);
  }, [onUploadError]);

  const startUpload = useCallback((fileName: string) => {
    setUploadProgress({
      fileName,
      progress: 0,
      isUploading: true,
      error: null
    });
  }, []);

  const completeUpload = useCallback((url: string) => {
    setUploadProgress(prev => 
      prev ? { ...prev, progress: 100, isUploading: false } : null
    );
    onUploadComplete?.(url);
  }, [onUploadComplete]);

  return {
    uploadProgress,
    validateFile,
    resetUpload,
    updateProgress,
    setError,
    startUpload,
    completeUpload
  };
}