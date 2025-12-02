'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AUTH_CONFIG } from '@/config/auth.config';
import { UpdateProductData, ProductCategory, Product } from '@/domain/product/product.entity';
import { updateProduct, getAllCategories, validateCanStarProduct } from '@/lib/actions/product.actions';
import { uploadProductImage } from '@/lib/actions/storage.actions';
import { Button } from '@/components/ui/Button';
import { StringArrayInput } from '@/components/ui/StringArrayInput';
import { ImageUploadGrid } from './ImageUploadGrid';
import { ProductFormFields } from './ProductFormFields';
import { MetadataFields } from './MetadataFields';
import { NotificationContainer, useNotification } from '@/components/ui/NotificationContainer';

interface ProductImage {
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

interface EditProductFormProps {
  product: Product;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const t = useTranslations('admin.products.edit');
  const categoriesT = useTranslations('admin.products.categories');
  const imagesT = useTranslations('admin.products.images');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { notifications, removeNotification, showError, showSuccess } = useNotification();
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Form data - mirrors CreateProductForm but with optional fields
  const [formData, setFormData] = useState<UpdateProductData>({
    code: product.code,
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    categoryId: product.category.id,
    isStarred: product.isStarred || false,
    badge: product.badge || null,
    tags: product.tags || [],
    metadata: {
      weight: product.metadata?.weight || 0,
      dimensions: {
        length: product.metadata?.dimensions?.length || 0,
        width: product.metadata?.dimensions?.width || 0,
        height: product.metadata?.dimensions?.height || 0,
      },
      materials: product.metadata?.materials || [],
    },
  });

  const [images, setImages] = useState<ProductImage[]>(
    product.images?.map((img, index) => ({
      url: img.url,
      alt: img.alt || '',
      order: img.order || index,
      isPrimary: img.isPrimary || index === 0
    })) || []
  );
  
  const [tags, setTags] = useState<string[]>(product.tags || []);
  const [materials, setMaterials] = useState<string[]>(product.metadata?.materials || []);

  // Helper to detect if images have changed
  const hasImagesChanged = (): boolean => {
    const originalImages = product.images?.map((img, index) => ({
      url: img.url,
      alt: img.alt || '',
      order: img.order || index,
      isPrimary: img.isPrimary || index === 0
    })) || [];

    // Different length means changed
    if (images.length !== originalImages.length) {
      return true;
    }

    // Check if any image details changed
    return images.some((img, index) => {
      const orig = originalImages[index];
      return img.url !== orig.url || img.alt !== orig.alt || img.isPrimary !== orig.isPrimary;
    });
  };

  // Validation helper - consolidates field checks
  const validateForm = (): boolean => {
    const validations = [
      { condition: !formData.code?.trim(), message: t('validation.codeRequired') },
      { condition: !formData.name?.trim(), message: t('validation.nameRequired') },
      { condition: formData.price! <= 0, message: t('validation.priceRequired') },
      { condition: formData.stock! < 0, message: t('validation.stockRequired') },
      { condition: !formData.categoryId, message: t('validation.categoryRequired') },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        showError(t('validation.title'), validation.message);
        return false;
      }
    }
    return true;
  };

  // Image upload helper - extracts upload logic
  const uploadImage = async (image: ProductImage, index: number, productId: string): Promise<{ url: string; alt?: string; order: number; isPrimary: boolean } | null> => {
    // Only process data URLs (local uploads)
    if (!image.url.startsWith('data:image')) {
      return null;
    }

    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const file = new File([blob], image.alt || `image-${index}.jpg`, { type: blob.type });
      
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('productId', productId);
      
      const uploadResult = await uploadProductImage(formDataObj);
      
      if (uploadResult.success && uploadResult.data?.url) {
        return {
          url: uploadResult.data.url,
          alt: image.alt,
          order: image.order,
          isPrimary: image.isPrimary,
        };
      }
    } catch (uploadError) {
      console.error(`Error uploading image ${index}:`, uploadError);
    }
    return null;
  };

  const handleStarToggle = async (newStarState: boolean): Promise<boolean> => {
    // Only validate if trying to star (newStarState === true)
    if (!newStarState) {
      // Unstarring, always allowed
      return true;
    }

    // If product is already starred, allow changing other fields without validation
    if (product.isStarred) {
      return true;
    }

    // Trying to star a product, validate the limit
    const validationResult = await validateCanStarProduct(product.id);
    
    if (!validationResult.success) {
      showError(
        t('notifications.starLimitReachedTitle'),
        t('notifications.starLimitReachedMessage')
      );
      return false;
    }

    return true;
  };

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getAllCategories();
        if (result.success && result.data?.items) {
          setCategories(result.data.items);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    }
    
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation using helper - if validation fails, it shows error via notification
    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        // Check if images have changed
        const imagesChanged = hasImagesChanged();

        // Step 1: Update product with current form data
        const updateData: UpdateProductData = {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          categoryId: formData.categoryId,
          isStarred: formData.isStarred,
          badge: formData.badge,
          tags,
          metadata: {
            weight: formData.metadata?.weight || 0,
            dimensions: {
              length: formData.metadata?.dimensions?.length || 0,
              width: formData.metadata?.dimensions?.width || 0,
              height: formData.metadata?.dimensions?.height || 0,
            },
            materials,
          },
          shouldUpdateImages: imagesChanged,
        };

        // Step 2: If images changed, collect all images (new and existing)
        if (imagesChanged) {
          const finalImages: Array<{ url: string; alt?: string; order: number; isPrimary: boolean }> = [];
          
          for (let i = 0; i < images.length; i++) {
            const uploadedImage = await uploadImage(images[i], i, product.id);
            // If upload happened (new image), use the uploaded result
            if (uploadedImage) {
              finalImages.push(uploadedImage);
            } else {
              // If no upload (existing image), keep the original
              finalImages.push({
                url: images[i].url,
                alt: images[i].alt,
                order: images[i].order,
                isPrimary: images[i].isPrimary
              });
            }
          }
          updateData.images = finalImages;
        }

        const result = await updateProduct(product.id, updateData);

        if (result.success) {
          // ✅ Use notification system instead of state + div
          showSuccess(t('success.updated'), t('success.updatedMessage'));
          setTimeout(() => {
            router.push(AUTH_CONFIG.ROUTES.PRODUCTS);
          }, 1500);
        } else {
          const errorMsg = result.error || t('error.updateFailed');
          showError(t('error.title'), errorMsg);
        }
      } catch (error) {
        console.error('Error updating product:', error);
        showError(t('error.title'), t('error.updateFailed'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* All messages now use NotificationContainer - no inline divs */}

      <ProductFormFields
        formData={{
          code: formData.code ?? '',
          name: formData.name ?? '',
          description: formData.description ?? '',
          price: formData.price ?? 0,
          stock: formData.stock ?? 0,
          categoryId: formData.categoryId ?? '',
          isStarred: formData.isStarred ?? false,
          badge: formData.badge ?? null,
          tags: formData.tags,
          metadata: {
            weight: formData.metadata?.weight ?? 0,
            dimensions: {
              length: formData.metadata?.dimensions?.length ?? 0,
              width: formData.metadata?.dimensions?.width ?? 0,
              height: formData.metadata?.dimensions?.height ?? 0,
            },
            materials: formData.metadata?.materials ?? [],
          },
        }}
        onFormDataChange={setFormData}
        onStarToggle={handleStarToggle}
        categories={categories}
        loadingCategories={loadingCategories}
        errors={{}}
        translations={{
          fields: {
            code: `${t('fields.code')}`,
            name: `${t('fields.name')}`,
            description: `${t('fields.description')}`,
            price: `${t('fields.price')}`,
            stock: `${t('fields.stock')}`,
            category: `${t('fields.category')}`,
            isStarred: t('fields.isStarred') ?? 'Featured Product',
            badge: t('fields.badge') ?? 'Badge',
          },
          placeholders: {
            code: t('placeholders.code'),
            name: t('placeholders.name'),
            description: t('placeholders.description'),
          },
          badges: {
            none: t('badges.none') ?? 'None',
            new: t('badges.new') ?? 'New',
            sale: t('badges.sale') ?? 'Sale',
          },
          selectCategory: t('selectCategory'),
          loading: t('loading'),
        }}
        categoriesTranslations={categoriesT}
      />

      {/* Images - Full Width Section */}
      <ImageUploadGrid
        images={images}
        onImagesChange={setImages}
        productName={formData.name || 'Product'}
        translations={{
          primaryImage: imagesT('primaryImage'),
          image: imagesT('image'),
          dragDropHint: imagesT('dragDropHint'),
          reorderHint: imagesT('reorderHint'),
          clickToUpload: imagesT('clickToUpload'),
          uploading: imagesT('uploading'),
          uploadError: imagesT('uploadError'),
          file: imagesT('file'),
          files: imagesT('files'),
          slot: imagesT('slot'),
        }}
      />

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StringArrayInput
          label={t('fields.tags')}
          placeholder={t('placeholders.tags')}
          items={tags}
          onItemsChange={setTags}
          id="tags"
        />
        
        <StringArrayInput
          label={t('fields.materials')}
          placeholder={t('placeholders.materials')}
          items={materials}
          onItemsChange={setMaterials}
          id="materials"
        />
      </div>

      <MetadataFields
        formData={{
          code: formData.code ?? '',
          name: formData.name ?? '',
          description: formData.description ?? '',
          price: formData.price ?? 0,
          stock: formData.stock ?? 0,
          categoryId: formData.categoryId ?? '',
          isStarred: formData.isStarred ?? false,
          badge: formData.badge ?? null,
          tags: formData.tags,
          metadata: {
            weight: formData.metadata?.weight ?? 0,
            dimensions: {
              length: formData.metadata?.dimensions?.length ?? 0,
              width: formData.metadata?.dimensions?.width ?? 0,
              height: formData.metadata?.dimensions?.height ?? 0,
            },
            materials: formData.metadata?.materials ?? [],
          },
        }}
        onFormDataChange={setFormData}
        translations={{
          fields: {
            weight: t('fields.weight'),
            dimensions: t('fields.dimensions'),
          },
          placeholders: {
            length: t('placeholders.length'),
            width: t('placeholders.width'),
            height: t('placeholders.height'),
          },
          helpers: {
            dimensions: t('helpers.dimensions'),
          },
        }}
      />

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-8 border-t border-neutral-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(AUTH_CONFIG.ROUTES.PRODUCTS)}
          disabled={isPending}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? t('actions.updating') : t('actions.update')}
        </Button>
      </div>

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </form>
  );
}