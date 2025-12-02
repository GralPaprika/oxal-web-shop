interface UploadStatusProps {
  uploadingFiles: Set<string>;
  uploadErrors: Record<string, string>;
  uploadProgress?: {
    fileName: string;
    progress: number;
    isUploading: boolean;
    error: string | null;
  } | null;
  translations: {
    uploading: string;
    uploadError: string;
  };
}

export function UploadStatus({
  uploadingFiles,
  uploadErrors,
  uploadProgress,
  translations
}: UploadStatusProps) {
  const hasActivity = uploadingFiles.size > 0 || Object.keys(uploadErrors).length > 0 || uploadProgress;
  
  if (!hasActivity) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {uploadProgress && (
        <div className="bg-background-tertiary border border-primary-200 rounded-lg p-3">
          {uploadProgress.isUploading ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-primary font-medium">
                  {translations.uploading}: {uploadProgress.fileName}
                </span>
                <span className="text-sm text-text-secondary">
                  {uploadProgress.progress}%
                </span>
              </div>
              <div className="w-full bg-primary-100 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            </div>
          ) : uploadProgress.error ? (
            <div className="text-red-600 text-sm font-medium">
              {translations.uploadError}: {uploadProgress.error}
            </div>
          ) : null}
        </div>
      )}

      {uploadingFiles.size > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <p className="text-sm text-primary-700 font-medium">
            {translations.uploading} {uploadingFiles.size} archivos...
          </p>
        </div>
      )}

      {Object.keys(uploadErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {Object.entries(uploadErrors).map(([fileKey, error]) => (
            <p key={fileKey} className="text-sm text-red-700 font-medium">
              {translations.uploadError}: {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}