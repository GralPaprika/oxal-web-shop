'use client';

import { useState, useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useFileUpload } from '@/hooks/useFileUpload';
import { imageUtils, type ProductImage } from '@/utils/imageUtils';
import { ImageItem } from './ImageItem';
import { UploadZone } from './UploadZone';

interface ImageUploadGridProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  productName: string;
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
    slot: string;
  };
  maxImages?: number;
}

export function ImageUploadGrid({
  images,
  onImagesChange,
  translations,
  maxImages = imageUtils.DEFAULT_MAX_IMAGES
}: ImageUploadGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { validateFile, setError } = useFileUpload({
    onUploadComplete: () => {},
    onUploadError: () => {}
  });

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const fileArray = Array.from(files);
    const availableSlots = maxImages - images.length;
    const filesToProcess = fileArray.slice(0, availableSlots);

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
  };

  const removeImage = (index: number) => {
    const updatedImages = imageUtils.removeImage(images, index);
    onImagesChange(updatedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {translations.reorderHint}
      </p>

      <div 
        className="relative grid grid-cols-3 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ minHeight: '320px' }}
      >
        {Array.from({ length: maxImages }, (_, index) => {
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
          
          return (
            <div 
              key={`empty-slot-${index}`} 
              className="aspect-square border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center relative z-0"
            >
              <div className="text-center">
                <CloudArrowUpIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">{translations.slot} {index + 1}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}