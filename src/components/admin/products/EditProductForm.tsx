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
  const t = useTranslations('admin.products');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { notifications, removeNotification, showError, showSuccess } = useNotification();
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
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

  const hasImagesChanged = (): boolean => {
    const originalImages = product.images?.map((img, index) => ({
      url: img.url,
      alt: img.alt || '',
      order: img.order || index,
      isPrimary: img.isPrimary || index === 0
    })) || [];

    if (images.length !== originalImages.length) {
      return true;
    }

    return images.some((img, index) => {
      const orig = originalImages[index];
      return img.url !== orig.url || img.alt !== orig.alt || img.isPrimary !== orig.isPrimary;
    });
  };

  const validateForm = (): boolean => {
    const validations = [
      { condition: !formData.code?.trim(), message: t('form.validation.codeRequired') },
      { condition: !formData.name?.trim(), message: t('form.validation.nameRequired') },
      { condition: formData.price! <= 0, message: t('form.validation.priceRequired') },
      { condition: formData.stock! < 0, message: t('form.validation.stockRequired') },
      { condition: !formData.categoryId, message: t('form.validation.categoryRequired') },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        showError(t('edit.validation.title'), validation.message);
        return false;
      }
    }
    return true;
  };

  const uploadImage = async (image: ProductImage, index: number, productId: string): Promise<{ url: string; alt?: string; order: number; isPrimary: boolean } | null> => {
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
    if (!newStarState) {
      return true;
    }

    if (product.isStarred) {
      return true;
    }

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

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        const imagesChanged = hasImagesChanged();

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

        if (imagesChanged) {
          const finalImages: Array<{ url: string; alt?: string; order: number; isPrimary: boolean }> = [];
          
          for (let i = 0; i < images.length; i++) {
            const uploadedImage = await uploadImage(images[i], i, product.id);
            if (uploadedImage) {
              finalImages.push(uploadedImage);
            } else {
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
          showSuccess(t('edit.success.updated'), t('edit.success.updatedMessage'));
          setTimeout(() => {
            router.push(AUTH_CONFIG.ROUTES.PRODUCTS);
          }, 1500);
        } else {
          const errorMsg = result.error || t('edit.error.updateFailed');
          showError(t('edit.error.title'), errorMsg);
        }
      } catch (error) {
        console.error('Error updating product:', error);
        showError(t('edit.error.title'), t('edit.error.updateFailed'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          selectCategory: t('form.selectCategory'),
          loading: t('form.loading'),
        }}
        categoriesTranslations={(key) => t(`categories.${key}`)}
      />
      <ImageUploadGrid
        images={images}
        onImagesChange={setImages}
        productName={formData.name || 'Product'}
        translations={{
          primaryImage: t('form.fields.images.primaryImage'),
          image: t('form.fields.images.image'),
          dragDropHint: t('form.fields.images.dragDropHint'),
          reorderHint: t('form.fields.images.reorderHint'),
          clickToUpload: t('form.fields.images.clickToUpload'),
          uploading: t('form.fields.images.uploading'),
          uploadError: t('form.fields.images.uploadError'),
          file: t('form.fields.images.file'),
          files: t('form.fields.images.files'),
          slot: t('form.fields.images.slot'),
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StringArrayInput
          label={t('form.fields.tags')}
          placeholder={t('form.placeholders.tags')}
          items={tags}
          onItemsChange={setTags}
          id="tags"
        />
        
        <StringArrayInput
          label={t('form.fields.materials')}
          placeholder={t('form.placeholders.materials')}
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
      />
      <div className="flex justify-end gap-4 pt-8 border-t border-neutral-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(AUTH_CONFIG.ROUTES.PRODUCTS)}
          disabled={isPending}
        >
          {t('form.buttons.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? t('form.buttons.updating') : t('form.buttons.update')}
        </Button>
      </div>

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </form>
  );
}