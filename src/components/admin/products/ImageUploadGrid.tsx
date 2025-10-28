'use client';

import { useState, useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { uploadProductImage, deleteProductImage } from '@/lib/actions/storage.actions';
import { useFileUpload } from '@/hooks/useFileUpload';
import { imageUtils, type ProductImage } from '@/utils/imageUtils';
import { ImageItem } from './ImageItem';
import { UploadZone } from './UploadZone';
import { UploadStatus } from './UploadStatus';

interface ImageUploadGridProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  productName: string;
  productId?: string;
  mode?: 'create' | 'edit';
  translations: {
    primaryImage: string;
    image: string;
    dragDropHint: string;
    reorderHint: string;
    clickToUpload: string;
    uploading: string;
    uploadError: string;
    file: string;
    files: string;
  };
  maxImages?: number;
}

export function ImageUploadGrid({
  images,
  onImagesChange,
  productName, // eslint-disable-line @typescript-eslint/no-unused-vars
  productId,
  mode = 'create',
  translations,
  maxImages = imageUtils.DEFAULT_MAX_IMAGES
}: ImageUploadGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadProgress, validateFile, resetUpload, startUpload, completeUpload, setError } = useFileUpload({
    onUploadComplete: (url: string) => {
      const updatedImages = imageUtils.addImage(images, url, maxImages);
      onImagesChange(updatedImages);
      resetUpload();
    },
    onUploadError: (error: string) => {
      console.error('Upload error:', error);
    }
  });

  // Handle file upload based on mode
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const fileArray = Array.from(files);
    const availableSlots = maxImages - images.length;
    const filesToProcess = fileArray.slice(0, availableSlots);

    if (mode === 'create') {
      // Create mode: Add preview URLs immediately
      const newImages: ProductImage[] = [];
      
      for (const [index, file] of filesToProcess.entries()) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        try {
          const dataUrl = await imageUtils.fileToDataUrl(file);
          const newImage: ProductImage = {
            url: dataUrl,
            alt: file.name,
            order: images.length + index,
            isPrimary: images.length === 0 && index === 0,
          };
          newImages.push(newImage);
        } catch {
          setError('Error creating preview');
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        onImagesChange(updatedImages);
      }
    } else if (mode === 'edit' && productId) {
      // Edit mode: Upload to Firebase immediately
      setUploadErrors({});

      for (const [index, file] of filesToProcess.entries()) {
        const validationError = validateFile(file);
        if (validationError) {
          setUploadErrors(prev => ({
            ...prev,
            [`${file.name}-${Date.now()}-${index}`]: validationError
          }));
          continue;
        }

        const fileKey = `${file.name}-${Date.now()}-${index}`;
        
        try {
          setUploadingFiles(prev => new Set(prev).add(fileKey));
          startUpload(file.name);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('productId', productId);

          const result = await uploadProductImage(formData);
          
          if (result.success && result.url) {
            completeUpload(result.url);
          } else {
            setUploadErrors(prev => ({
              ...prev,
              [fileKey]: result.error || translations.uploadError
            }));
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setUploadErrors(prev => ({
            ...prev,
            [fileKey]: translations.uploadError
          }));
        } finally {
          setUploadingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(fileKey);
            return newSet;
          });
        }
      }
    }
  };

  // Remove image
  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // If it's a Firebase Storage URL, delete from storage
    if (imageUtils.isFirebaseUrl(imageToRemove.url)) {
      try {
        await deleteProductImage(imageToRemove.url);
      } catch (error) {
        console.error('Error deleting image from storage:', error);
        // Continue with removal from UI even if storage deletion fails
      }
    }
    
    const updatedImages = imageUtils.removeImage(images, index);
    onImagesChange(updatedImages);
  };

  // Drag and drop handlers for image reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <p className="text-sm text-gray-600">
        {translations.reorderHint}
      </p>

      {/* Image Grid - Fixed 3x2 layout with proper spacing */}
      <div 
        className="relative grid grid-cols-3 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ minHeight: '320px' }}
      >
        {/* Render existing images and upload slots */}
        {Array.from({ length: 6 }, (_, index) => {
          const image = images[index];
          
          if (image) {
            return (
              <div key={`image-${index}`} className="aspect-square relative z-0">
                <ImageItem
                  image={image}
                  index={index}
                  translations={translations}
                  onRemove={removeImage}
                  onDragStart={handleDragStart}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={targetIndex => {
                    if (draggedIndex !== null) {
                      const reorderedImages = imageUtils.reorderImages(images, draggedIndex, targetIndex);
                      onImagesChange(reorderedImages);
                      setDraggedIndex(null);
                    }
                  }}
                  isDraggedOver={false}
                />
              </div>
            );
          }
          
          // Empty slot - show upload zone only for the first empty slot
          if (index === images.length) {
            return (
              <div key={`upload-slot-${index}`} className="aspect-square relative z-0">
                <UploadZone
                  onFileSelect={handleFileUpload}
                  isDragOver={false}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDragLeave={() => {}}
                  onDrop={(e) => {
                    e.preventDefault();
                  }}
                  fileInputRef={fileInputRef}
                  translations={translations}
                  maxImages={maxImages}
                  currentImageCount={images.length}
                  isFirstEmpty={true}
                />
              </div>
            );
          }
          
          // Other empty slots - show placeholder
          return (
            <div 
              key={`empty-slot-${index}`} 
              className="aspect-square border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center relative z-0"
            >
              <div className="text-center">
                <CloudArrowUpIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Slot {index + 1}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Status */}
      <UploadStatus
        uploadingFiles={uploadingFiles}
        uploadErrors={uploadErrors}
        uploadProgress={uploadProgress}
        translations={translations}
      />
    </div>
  );
}