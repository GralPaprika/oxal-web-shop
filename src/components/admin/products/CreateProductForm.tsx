'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AUTH_CONFIG } from '@/config/auth.config';
import { CreateProductData, ProductCategory } from '@/src/domain/product/product.entity';
import { createProduct, getAllCategories, updateProductImages } from '@/lib/actions/product.actions';
import { uploadProductImage } from '@/lib/actions/storage.actions';
import { Button } from '@/components/ui/Button';
import { ImageUploadGrid } from './ImageUploadGrid';
import { 
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ProductImage {
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

export function CreateProductForm() {
  const t = useTranslations('admin.products.create');
  const categoriesT = useTranslations('admin.products.categories');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState<CreateProductData>({
    code: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
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
  const [newTag, setNewTag] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        if (result.success && result.categories) {
          setCategories(result.categories);
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
        // Step 1: Create product without images
        const productData: CreateProductData = {
          ...formData,
          images: [], // Empty images array initially
        };

        const result = await createProduct(productData);
        
        if (result.success && result.product) {
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
                  formData.append('productId', result.product.id);
                  
                  const uploadResult = await uploadProductImage(formData);
                  
                  if (uploadResult.success && uploadResult.url) {
                    uploadedImages.push({
                      url: uploadResult.url,
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
              await updateProductImages(result.product.id, uploadedImages);
            }
          }
          
          setSuccess(t('success.created'));
          setTimeout(() => {
            router.push(AUTH_CONFIG.ROUTES.PRODUCTS);
          }, 1500);
        } else {
          setError('error' in result ? result.error : t('error.failed'));
        }
      } catch (error) {
        console.error('Error creating product:', error);
        setError(t('error.failed'));
      }
    });
  };

  const addTag = () => {
    if (!newTag.trim() || formData.tags?.includes(newTag.trim())) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag.trim()],
    }));
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const addMaterial = () => {
    if (!newMaterial.trim() || formData.metadata?.materials?.includes(newMaterial.trim())) return;
    
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        materials: [...(prev.metadata?.materials || []), newMaterial.trim()],
      },
    }));
    setNewMaterial('');
  };

  const removeMaterial = (materialToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        materials: prev.metadata?.materials?.filter(material => material !== materialToRemove) || [],
      },
    }));
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

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <label htmlFor="code" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.code')} *
          </label>
          <input
            type="text"
            id="code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder={t('form.codePlaceholder')}
            required
          />
        </div>

        <div className="md:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.name')} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder={t('form.namePlaceholder')}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
          {t('form.description')}
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          placeholder={t('form.descriptionPlaceholder')}
        />
      </div>

      {/* Pricing and Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.price')} *
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.stock')} *
          </label>
          <input
            type="number"
            id="stock"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="0"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.category')} *
          </label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            required
            disabled={loadingCategories}
          >
            <option value="">{loadingCategories ? t('form.loadingCategories') : t('form.selectCategory')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {categoriesT(category.key)}
              </option>
            ))}
          </select>
        </div>
      </div>

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
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.tags')}
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              placeholder={t('form.tagPlaceholder')}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-amber-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.materials')}
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="materials"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              placeholder={t('form.materialPlaceholder')}
            />
            <button
              type="button"
              onClick={addMaterial}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.metadata?.materials?.map((material, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
              >
                {material}
                <button
                  type="button"
                  onClick={() => removeMaterial(material)}
                  className="hover:text-amber-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-text-primary mb-2">
            {t('form.weight')}
          </label>
          <div className="relative">
            <input
              type="number"
              id="weight"
              min="0"
              step="0.01"
              value={formData.metadata?.weight || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  weight: parseFloat(e.target.value) || 0,
                },
              }))}
              className="w-full px-3 py-2 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted">kg</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t('form.length')} x {t('form.width')} x {t('form.height')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.metadata?.dimensions?.length || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    dimensions: {
                      length: parseFloat(e.target.value) || 0,
                      width: prev.metadata?.dimensions?.width || 0,
                      height: prev.metadata?.dimensions?.height || 0,
                    },
                  },
                }))}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm"
                placeholder={t('form.length')}
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.metadata?.dimensions?.width || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    dimensions: {
                      length: prev.metadata?.dimensions?.length || 0,
                      width: parseFloat(e.target.value) || 0,
                      height: prev.metadata?.dimensions?.height || 0,
                    },
                  },
                }))}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm"
                placeholder={t('form.width')}
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.metadata?.dimensions?.height || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    dimensions: {
                      length: prev.metadata?.dimensions?.length || 0,
                      width: prev.metadata?.dimensions?.width || 0,
                      height: parseFloat(e.target.value) || 0,
                    },
                  },
                }))}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm"
                placeholder={t('form.height')}
              />
            </div>
          </div>
          <p className="text-xs text-text-muted mt-1">Dimensiones en centímetros (largo x ancho x alto)</p>
        </div>
      </div>

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
    </form>
  );
}