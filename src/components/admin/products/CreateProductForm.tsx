'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AUTH_CONFIG } from '@/config/auth.config';
import { CreateProductData, ProductCategory } from '@/domain/product/product.entity';
import { createProduct, getAllCategories, updateProductImages, validateCanStarProduct } from '@/lib/actions/product.actions';
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
  const t = useTranslations('admin.products.create');
  const translations = useTranslations();
  const categoriesT = useTranslations('admin.products.categories');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { notifications, removeNotification, showError } = useNotification();
  
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
    images: [],
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
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleStarToggle = async (newStarState: boolean): Promise<boolean> => {
    // Only validate if trying to star (newStarState === true)
    if (!newStarState) {
      // Unstarring, always allowed
      return true;
    }

    // Trying to star, validate the limit
    const validationResult = await validateCanStarProduct('');
    
    if (!validationResult.success) {
      showError(
        translations('admin.products.notifications.limitReached'),
        translations('admin.products.notifications.limitReachedMessage')
      );
      return false;
    }

    return true;
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        if (result.success && result.data?.items) {
          setCategories(result.data.items);
        } else {
          setError(t('error.categoriesLoad'));
        }
      } catch {
        setError(t('error.categoriesLoad'));
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError(t('validation.nameRequired'));
      return;
    }
    if (!formData.code.trim()) {
      setError(t('validation.codeRequired'));
      return;
    }
    if (formData.price <= 0) {
      setError(t('validation.priceRequired'));
      return;
    }
    if (formData.stock < 0) {
      setError(t('validation.stockRequired'));
      return;
    }
    if (!formData.categoryId) {
      setError(t('validation.categoryRequired'));
      return;
    }

    startTransition(async () => {
      try {
        // Step 1: Create product with current data
        const productData: CreateProductData = {
          ...formData,
          tags,
          metadata: {
            ...formData.metadata,
            materials,
          },
          images: [], // Empty images array initially
        };

        const result = await createProduct(productData);
        
        if (result.success && result.data) {
          // Step 2: Upload images to Firebase Storage and update product
          if (images.length > 0) {
            const uploadedImages: Array<{ url: string; alt?: string; order: number; isPrimary: boolean }> = [];
            
            for (let i = 0; i < images.length; i++) {
              const image = images[i];
              
              // Only upload if it's a preview URL (data:image)
              if (image.url.startsWith('data:image')) {
                try {
                  // Convert data URL back to File
                  const response = await fetch(image.url);
                  const blob = await response.blob();
                  const file = new File([blob], image.alt || `image-${i}.jpg`, { type: blob.type });
                  
                  // Upload to Firebase Storage
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('productId', result.data.id);
                  
                  const uploadResult = await uploadProductImage(formData);
                  
                  if (uploadResult.success && uploadResult.data?.url) {
                    uploadedImages.push({
                      url: uploadResult.data.url,
                      alt: image.alt,
                      order: image.order,
                      isPrimary: image.isPrimary,
                    });
                  }
                } catch (uploadError) {
                  console.error('Error uploading image:', uploadError);
                  // Continue with other images even if one fails
                }
              }
            }
            
            // Step 3: Update product with uploaded image URLs
            if (uploadedImages.length > 0) {
              await updateProductImages(result.data.id, uploadedImages);
            }
          }
          
          setSuccess(t('success.created'));
          setTimeout(() => {
            router.push(AUTH_CONFIG.ROUTES.PRODUCTS);
          }, 1500);
        } else {
          setError('error' in result ? String(result.error) : t('error.failed'));
        }
      } catch (error) {
        console.error('Error creating product:', error);
        setError(t('error.failed'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      <ProductFormFields
        formData={formData}
        onFormDataChange={setFormData}
        onStarToggle={handleStarToggle}
        categories={categories}
        loadingCategories={loadingCategories}
        errors={{}}
        translations={{
          fields: {
            code: `${t('form.code')}`,
            name: `${t('form.name')}`,
            description: t('form.description'),
            price: `${t('form.price')}`,
            stock: `${t('form.stock')}`,
            category: `${t('form.category')}`,
            isStarred: t('form.isStarred') ?? 'Featured Product',
            badge: t('form.badge') ?? 'Badge',
          },
          placeholders: {
            code: t('form.codePlaceholder'),
            name: t('form.namePlaceholder'),
            description: t('form.descriptionPlaceholder'),
          },
          badges: {
            none: t('form.badges.none') ?? 'None',
            new: t('form.badges.new') ?? 'New',
            sale: t('form.badges.sale') ?? 'Sale',
          },
          selectCategory: t('form.selectCategory'),
          loading: t('form.loadingCategories'),
        }}
        categoriesTranslations={categoriesT}
      />

      {/* Images */}
      <ImageUploadGrid
        images={images}
        onImagesChange={setImages}
        productName={formData.name}
        mode="create"
        translations={{
          primaryImage: t('form.primaryImage'),
          image: t('form.image'),
          dragDropHint: t('form.dragDropHint'),
          reorderHint: t('form.reorderHint'),
          clickToUpload: t('form.clickToUpload'),
          uploading: t('form.uploading'),
          uploadError: t('form.uploadError'),
          file: t('form.file'),
          files: t('form.files'),
          slot: t('form.slot'),
        }}
      />

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StringArrayInput
          label={t('form.tags')}
          placeholder={t('form.tagPlaceholder')}
          items={tags}
          onItemsChange={setTags}
          id="tags"
        />
        
        <StringArrayInput
          label={t('form.materials')}
          placeholder={t('form.materialPlaceholder')}
          items={materials}
          onItemsChange={setMaterials}
          id="materials"
        />
      </div>

      <MetadataFields
        formData={formData}
        onFormDataChange={setFormData}
        translations={{
          fields: {
            weight: t('form.weight'),
            dimensions: `${t('form.length')} x ${t('form.width')} x ${t('form.height')}`,
          },
          placeholders: {
            length: t('form.length'),
            width: t('form.width'),
            height: t('form.height'),
          },
          helpers: {
            dimensions: 'Dimensiones en centímetros (largo x ancho x alto)',
          },
        }}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-neutral-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(AUTH_CONFIG.ROUTES.PRODUCTS)}
          disabled={isPending}
        >
          {t('form.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2"
        >
          {isPending ? t('form.creating') : t('form.createProduct')}
        </Button>
      </div>

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </form>
  );
}