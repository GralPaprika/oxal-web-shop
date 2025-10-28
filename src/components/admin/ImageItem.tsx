import Image from 'next/image';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { type ProductImage } from '@/utils/imageUtils';

interface ImageItemProps {
  image: ProductImage;
  index: number;
  translations: {
    primaryImage: string;
    image: string;
  };
  onRemove: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (index: number) => void;
  isDraggedOver?: boolean;
}

export function ImageItem({
  image,
  index,
  translations,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver = false
}: ImageItemProps) {
  return (
    <div
      className={`
        relative group border-2 rounded-lg overflow-hidden h-full w-full
        transition-all duration-200
        ${isDraggedOver ? 'border-primary-400 bg-primary-500 bg-opacity-20' : 'border-gray-200'}
        ${image.isPrimary ? 'ring-2 ring-primary-500' : ''}
      `}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(index)}
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Bars3Icon className="h-5 w-5 text-gray-600 bg-white rounded p-1 shadow-sm" />
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
        type="button"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>

      {/* Image */}
      <Image
        src={image.url}
        alt={image.alt || `${translations.image} ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />

      {/* Primary image badge */}
      {image.isPrimary && (
        <div className="absolute bottom-2 left-2 z-20">
          <div className="bg-amber-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg border border-white">
            {translations.primaryImage}
          </div>
        </div>
      )}
    </div>
  );
}