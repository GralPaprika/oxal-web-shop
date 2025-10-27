'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { AUTH_CONFIG } from '@/config/auth.config';
import { CreateProductData, ProductCategory } from '@/src/domain/product/product.entity';
import { createProduct, getAllCategories } from '@/lib/actions/product.actions';
import { Button } from '@/components/ui/Button';
import { 
  PhotoIcon,
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
  const [newImageUrl, setNewImageUrl] = useState('');
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
        const productData: CreateProductData = {
          ...formData,
          images: images.map(({ url, alt, order, isPrimary }) => ({
            url,
            alt,
            order,
            isPrimary,
          })),
        };

        const result = await createProduct(productData);
        
        if (result.success) {
          setSuccess(t('success.created'));
          setTimeout(() => {
            router.push(AUTH_CONFIG.ROUTES.PRODUCTS);
          }, 1500);
        } else {
          setError('error' in result ? result.error : t('error.failed'));
        }
      } catch {
        setError(t('error.failed'));
      }
    });
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    
    const newImage: ProductImage = {
      url: newImageUrl.trim(),
      alt: formData.name,
      order: images.length,
      isPrimary: images.length === 0,
    };
    
    setImages([...images, newImage]);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Update order and primary status
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i,
      isPrimary: i === 0,
    }));
    setImages(reorderedImages);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
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

        <div>
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
      <div>
        <label className="block text-sm font-medium text-text-primary mb-4">
          {t('form.images')}
        </label>
        
        <div className="space-y-4">
          {/* Add Image Input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder={t('form.imageUrlPlaceholder')}
            />
            <Button
              type="button"
              onClick={addImage}
              variant="outline"
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              {t('form.addImage')}
            </Button>
          </div>

          {/* Images List */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-muted">
                      {image.isPrimary ? t('form.primaryImage') : `${t('form.image')} ${index + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {image.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt || formData.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <PhotoIcon className="h-8 w-8 text-neutral-400" />
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-2 truncate">{image.url}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-4">
          {t('form.tags')}
        </label>
        
        <div className="space-y-4">
          {/* Add Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder={t('form.tagPlaceholder')}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              {t('form.addTag')}
            </Button>
          </div>

          {/* Tags List */}
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-amber-600 hover:text-amber-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-text-primary">{t('form.metadata')}</h3>
        
        {/* Weight and Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-text-primary mb-2">
              {t('form.weight')} (g)
            </label>
            <input
              type="number"
              id="weight"
              min="0"
              step="0.1"
              value={formData.metadata?.weight || 0}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  weight: parseFloat(e.target.value) || 0,
                },
              }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="0.0"
            />
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium text-text-primary mb-2">
              {t('form.length')} (cm)
            </label>
            <input
              type="number"
              id="length"
              min="0"
              step="0.1"
              value={formData.metadata?.dimensions?.length || 0}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  dimensions: {
                    ...prev.metadata?.dimensions,
                    length: parseFloat(e.target.value) || 0,
                    width: prev.metadata?.dimensions?.width || 0,
                    height: prev.metadata?.dimensions?.height || 0,
                  },
                },
              }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="0.0"
            />
          </div>

          <div>
            <label htmlFor="width" className="block text-sm font-medium text-text-primary mb-2">
              {t('form.width')} (cm)
            </label>
            <input
              type="number"
              id="width"
              min="0"
              step="0.1"
              value={formData.metadata?.dimensions?.width || 0}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  dimensions: {
                    ...prev.metadata?.dimensions,
                    length: prev.metadata?.dimensions?.length || 0,
                    width: parseFloat(e.target.value) || 0,
                    height: prev.metadata?.dimensions?.height || 0,
                  },
                },
              }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="0.0"
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-text-primary mb-2">
              {t('form.height')} (cm)
            </label>
            <input
              type="number"
              id="height"
              min="0"
              step="0.1"
              value={formData.metadata?.dimensions?.height || 0}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  dimensions: {
                    ...prev.metadata?.dimensions,
                    length: prev.metadata?.dimensions?.length || 0,
                    width: prev.metadata?.dimensions?.width || 0,
                    height: parseFloat(e.target.value) || 0,
                  },
                },
              }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="0.0"
            />
          </div>
        </div>

        {/* Materials */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-4">
            {t('form.materials')}
          </label>
          
          <div className="space-y-4">
            {/* Add Material Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder={t('form.materialPlaceholder')}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              />
              <Button
                type="button"
                onClick={addMaterial}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                {t('form.addMaterial')}
              </Button>
            </div>

            {/* Materials List */}
            {formData.metadata?.materials && formData.metadata.materials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.metadata.materials.map((material, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {material}
                    <button
                      type="button"
                      onClick={() => removeMaterial(material)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2"
        >
          {isPending ? t('form.creating') : t('form.createProduct')}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(AUTH_CONFIG.ROUTES.PRODUCTS)}
          disabled={isPending}
        >
          {t('form.cancel')}
        </Button>
      </div>
    </form>
  );
}