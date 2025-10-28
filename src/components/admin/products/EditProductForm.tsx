'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AUTH_CONFIG } from '@/config/auth.config';
import { CreateProductData, ProductCategory, Product } from '@/src/domain/product/product.entity';
import { updateProduct, getAllCategories, validateCanStarProduct } from '@/lib/actions/product.actions';
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
  const translations = useTranslations();
  const categoriesT = useTranslations('admin.products.categories');
  const imagesT = useTranslations('admin.products.images');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { notifications, removeNotification, showError } = useNotification();
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Initialize form data with product values
  const [formData, setFormData] = useState<CreateProductData>({
    code: product.code,
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    categoryId: product.category.id,
    isStarred: product.isStarred || false,
    badge: product.badge || null,
    images: product.images || [],
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    // Trying to star a new product, validate the limit
    const validationResult = await validateCanStarProduct(product.id);
    
    if (!validationResult.success) {
      showError(
        translations('admin.products.notifications.limitReached'),
        translations('admin.products.notifications.limitReachedMessage')
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
        if (result.success && result.categories) {
          setCategories(result.categories);
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
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = t('validation.codeRequired');
    if (!formData.name.trim()) newErrors.name = t('validation.nameRequired');
    if (!formData.description?.trim()) newErrors.description = t('validation.descriptionRequired');
    if (formData.price <= 0) newErrors.price = t('validation.priceRequired');
    if (formData.stock < 0) newErrors.stock = t('validation.stockRequired');
    if (!formData.categoryId) newErrors.categoryId = t('validation.categoryRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      try {
        // Update product with current form data
        const updateData = {
          ...formData,
          images,
          tags,
          metadata: {
            ...formData.metadata,
            materials,
          },
        };

        const result = await updateProduct(product.id, updateData);

        if (result.success) {
          router.push(AUTH_CONFIG.ROUTES.PRODUCTS);
        } else {
          setErrors({ general: 'error' in result ? result.error : t('error.updateFailed') });
        }
      } catch (error) {
        console.error('Error updating product:', error);
        setErrors({ general: t('error.updateFailed') });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <ProductFormFields
        formData={formData}
        onFormDataChange={setFormData}
        onStarToggle={handleStarToggle}
        categories={categories}
        loadingCategories={loadingCategories}
        errors={errors}
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
        productId={product.id}
        mode="edit"
        maxImages={6}
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
        formData={formData}
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