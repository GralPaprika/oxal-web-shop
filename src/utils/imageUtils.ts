interface ProductImage {
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

export const imageUtils = {
  DEFAULT_MAX_IMAGES: 6,
  FIREBASE_STORAGE_DOMAIN: 'firebase',
  FILE_READER_DATA_URL_PREFIX: 'data:image',

  isFirebaseUrl: (url: string): boolean => {
    return url.includes('firebase');
  },

  isPreviewUrl: (url: string): boolean => {
    return url.startsWith('data:image');
  },

  reorderImages: (images: ProductImage[], fromIndex: number, toIndex: number): ProductImage[] => {
    const result = [...images];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    
    return result.map((img, index) => ({
      ...img,
      order: index,
      isPrimary: index === 0
    }));
  },

  addImage: (images: ProductImage[], newImageUrl: string, maxImages: number = 6): ProductImage[] => {
    if (images.length >= maxImages) {
      return images;
    }

    const newImage: ProductImage = {
      url: newImageUrl,
      order: images.length,
      isPrimary: images.length === 0
    };

    return [...images, newImage];
  },

  removeImage: (images: ProductImage[], indexToRemove: number): ProductImage[] => {
    const filteredImages = images.filter((_, index) => index !== indexToRemove);
    
    return filteredImages.map((img, index) => ({
      ...img,
      order: index,
      isPrimary: index === 0
    }));
  },

  validateImageFile: (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo inválido. Tipos permitidos: ${allowedTypes.join(', ')}`;
    }

    if (file.size > maxSize) {
      return `Archivo muy grande. Tamaño máximo: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
    }

    return null;
  },

  fileToDataUrl: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

export type { ProductImage };