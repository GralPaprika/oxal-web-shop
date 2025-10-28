'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  XMarkIcon,
  CloudArrowUpIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { uploadProductImage, deleteProductImage } from '@/lib/actions/storage.actions';

interface ProductImage {
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

interface ImageUploadGridProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  productName: string;
  productId?: string; // Optional: when editing existing product
  mode?: 'create' | 'edit'; // New prop to determine behavior
  translations: {
    primaryImage: string;
    image: string;
    dragDropHint: string;
    reorderHint: string;
    clickToUpload: string;
    uploading: string;
    uploadError: string;
  };
  maxImages?: number;
}

export function ImageUploadGrid({ 
  images, 
  onImagesChange, 
  productName,
  productId,
  mode = 'create',
  translations,
  maxImages = 6 
}: ImageUploadGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // If it's a Firebase Storage URL, delete from storage
    if (imageToRemove.url.includes('firebase')) {
      try {
        await deleteProductImage(imageToRemove.url);
      } catch (error) {
        console.error('Error deleting image from storage:', error);
        // Continue with removal from UI even if storage deletion fails
      }
    }
    
    const updatedImages = images.filter((_, i) => i !== index);
    // Update order and primary status
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i,
      isPrimary: i === 0,
    }));
    onImagesChange(reorderedImages);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const availableSlots = maxImages - images.length;
    const filesToProcess = fileArray.slice(0, availableSlots);

    if (mode === 'create') {
      // For create mode, just show preview URLs
      let processedCount = 0;
      const newImages: ProductImage[] = [];

      filesToProcess.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            const newImage: ProductImage = {
              url: result, // Preview URL for create mode
              alt: file.name,
              order: images.length + index,
              isPrimary: images.length === 0 && index === 0,
            };
            
            newImages.push(newImage);
            processedCount++;

            if (processedCount === filesToProcess.length) {
              const updatedImages = [...images, ...newImages.sort((a, b) => a.order - b.order)];
              onImagesChange(updatedImages);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (mode === 'edit' && productId) {
      // For edit mode, upload to Firebase Storage immediately
      setUploadErrors({});

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const fileKey = `${file.name}-${Date.now()}-${i}`;
        
        try {
          setUploadingFiles(prev => new Set(prev).add(fileKey));

          const formData = new FormData();
          formData.append('file', file);
          formData.append('productId', productId);

          const result = await uploadProductImage(formData);
          
          if (result.success && result.url) {
            const newImage: ProductImage = {
              url: result.url,
              alt: file.name,
              order: images.length + i,
              isPrimary: images.length === 0 && i === 0,
            };
            
            const updatedImages = [...images, newImage].map((img, index) => ({
              ...img,
              order: index,
              isPrimary: index === 0,
            }));
            onImagesChange(updatedImages);
          } else {
            setUploadErrors(prev => ({
              ...prev,
              [fileKey]: result.error || 'Upload failed'
            }));
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploadErrors(prev => ({
            ...prev,
            [fileKey]: 'Upload failed'
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

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    const finalDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(finalDropIndex, 0, draggedImage);
    
    // Update order and primary status
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
      isPrimary: i === 0,
    }));
    
    onImagesChange(reorderedImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Drag and Drop Grid */}
      <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 bg-neutral-50">
        <div className="grid grid-cols-3 gap-4 min-h-[280px]">
          {/* Image Slots */}
          {Array.from({ length: maxImages }).map((_, index) => {
            const image = images[index];
            const isEmpty = !image;
            const isDraggedOver = dragOverIndex === index;
            const isDragged = draggedIndex === index;
            
            return (
              <div
                key={index}
                className={`
                  aspect-square border-2 border-dashed rounded-xl relative transition-all duration-200
                  ${isEmpty 
                    ? 'border-neutral-200 bg-white hover:border-amber-300 hover:bg-amber-50' 
                    : 'border-transparent bg-white shadow-sm hover:shadow-md'
                  }
                  ${isDraggedOver && !isEmpty ? 'border-amber-400 bg-amber-50' : ''}
                  ${isDragged ? 'opacity-50 scale-95' : ''}
                `}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                {isEmpty ? (
                  // Empty Slot
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="h-full w-full flex flex-col items-center justify-center text-neutral-400 hover:text-amber-600 transition-colors cursor-pointer"
                    disabled={images.length >= maxImages}
                  >
                    <CloudArrowUpIcon className="h-8 w-8 mb-2" />
                    <span className="text-xs text-center">
                      {index === 0 ? translations.primaryImage : `${translations.image} ${index + 1}`}
                    </span>
                    <span className="text-xs text-center mt-1 opacity-75">
                      {translations.clickToUpload}
                    </span>
                  </button>
                ) : (
                  // Image Slot with Content
                  <div
                    className="h-full relative group cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Drag Handle */}
                    <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black bg-opacity-50 rounded p-1">
                        <Bars3Icon className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                    
                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {translations.primaryImage}
                        </span>
                      </div>
                    )}
                    
                    {/* Image */}
                    <div className="h-full rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt || productName}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-text-muted">
            {images.length === 0 
              ? translations.dragDropHint
              : translations.reorderHint
            }
          </p>
        </div>
        
        {/* Upload Errors */}
        {Object.keys(uploadErrors).length > 0 && (
          <div className="mt-4 space-y-1">
            {Object.entries(uploadErrors).map(([key, error]) => (
              <p key={key} className="text-sm text-red-600">
                {translations.uploadError}: {error}
              </p>
            ))}
          </div>
        )}
        
        {/* Upload Progress */}
        {uploadingFiles.size > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-amber-600">
              {translations.uploading} ({uploadingFiles.size} {uploadingFiles.size === 1 ? 'archivo' : 'archivos'})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}