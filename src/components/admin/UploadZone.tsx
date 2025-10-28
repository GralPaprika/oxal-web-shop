import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  translations: {
    dragDropHint: string;
    clickToUpload: string;
    file: string;
    files: string;
  };
  maxImages: number;
  currentImageCount: number;
  isFirstEmpty?: boolean;
}

export function UploadZone({
  onFileSelect,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  fileInputRef,
  translations,
  maxImages,
  currentImageCount,
  isFirstEmpty = false
}: UploadZoneProps) {
  const remainingSlots = maxImages - currentImageCount;
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div
      className={`
        relative h-full w-full border-2 border-dashed rounded-lg p-6
        flex flex-col items-center justify-center cursor-pointer
        transition-all duration-200 min-h-[120px]
        ${isDragOver 
          ? 'border-primary-400 bg-primary-500 bg-opacity-20 border-solid' 
          : 'border-gray-300 bg-gray-50 hover:border-primary-300 hover:bg-primary-100 hover:bg-opacity-50'
        }
        ${isFirstEmpty ? 'border-primary-500 bg-primary-100 bg-opacity-30' : ''}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-3 group-hover:text-primary-500 transition-colors" />
      <p className="text-sm text-gray-600 font-medium mb-1 text-center hover:text-primary-700 transition-colors">
        {translations.dragDropHint}
      </p>
      <p className="text-xs text-gray-500 mb-3 text-center hover:text-primary-600 transition-colors">
        {translations.clickToUpload}
      </p>
      {remainingSlots > 0 && (
        <p className="text-xs text-gray-400 font-medium text-center hover:text-primary-600 transition-colors">
          {remainingSlots} {remainingSlots === 1 ? translations.file : translations.files} restantes
        </p>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}