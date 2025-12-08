'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AUTH_CONFIG } from '@/config/auth.config';
import { CreateProductData, ProductCategory } from '@/domain/product/product.entity';
import { createProduct, getAllCategories, updateProduct, validateCanStarProduct } from '@/lib/actions/product.actions';
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

export function CreateProductForm() {
  const t = useTranslations('admin.products');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { notifications, removeNotification, showError, showSuccess } = useNotification();
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState<CreateProductData>({
    code: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    isStarred: false,
    badge: null,
    tags: [],
    metadata: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      materials: [],
    },
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const validations = [
      { condition: !formData.name.trim(), message: t('form.validation.nameRequired') },
      { condition: !formData.code.trim(), message: t('form.validation.codeRequired') },
      { condition: formData.price <= 0, message: t('form.validation.priceRequired') },
      { condition: formData.stock < 0, message: t('form.validation.stockRequired') },
      { condition: !formData.categoryId, message: t('form.validation.categoryRequired') },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        showError(t('create.validation.title'), validation.message);
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

    const validationResult = await validateCanStarProduct('');
    
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
    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        if (result.success && result.data?.items) {
          setCategories(result.data.items);
        } else {
          showError(t('create.error.title'), t('create.error.categoriesLoad'));
        }
      } catch {
        showError(t('create.error.title'), t('create.error.categoriesLoad'));
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [t, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        const productData: CreateProductData = {
          ...formData,
          tags,
          metadata: {
            ...formData.metadata,
            materials,
          },
        };

        const result = await createProduct(productData);
        
        if (result.success && result.data) {
          if (images.length > 0) {
            const uploadedImages: Array<{ url: string; alt?: string; order: number; isPrimary: boolean }> = [];
            
            for (let i = 0; i < images.length; i++) {
              const uploadedImage = await uploadImage(images[i], i, result.data.id);
              if (uploadedImage) {
                uploadedImages.push(uploadedImage);
              }
            }
            
            if (uploadedImages.length > 0) {
              await updateProduct(result.data.id, {
                shouldUpdateImages: true,
                images: uploadedImages,
              });
            }
          }
          
          showSuccess(t('create.success.created'), t('create.success.createdMessage'));
          setTimeout(() => {
            router.push(AUTH_CONFIG.ROUTES.PRODUCTS);
          }, 1500);
        } else {
          const errorMsg = 'error' in result ? String(result.error) : t('create.error.failed');
          showError(t('create.error.title'), errorMsg);
        }
      } catch (error) {
        console.error('Error creating product:', error);
        showError(t('create.error.title'), t('create.error.failed'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProductFormFields
        formData={formData}
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
        productName={formData.name}
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
        formData={formData}
        onFormDataChange={setFormData}
      />

      <div className="flex justify-end gap-4 pt-6 border-t border-neutral-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(AUTH_CONFIG.ROUTES.PRODUCTS)}
          disabled={isPending}
        >
          {t('form.buttons.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2"
        >
          {isPending ? t('form.buttons.creating') : t('form.buttons.createProduct')}
        </Button>
      </div>

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </form>
  );
}