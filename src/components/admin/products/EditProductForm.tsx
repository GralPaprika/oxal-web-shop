'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AUTH_CONFIG } from '@/config/auth.config';
import { CreateProductData, ProductCategory, Product, UpdateProductData } from '@/src/domain/product/product.entity';
import { updateProduct, getAllCategories } from '@/lib/actions/product.actions';
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

interface EditProductFormProps {
  product: Product;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const t = useTranslations('admin.products.edit');
  const categoriesT = useTranslations('admin.products.categories');
  const imagesT = useTranslations('admin.products.images');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
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
  const [tagInput, setTagInput] = useState('');
  const [materials, setMaterials] = useState<string[]>(product.metadata?.materials || []);
  const [materialInput, setMaterialInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (field: keyof CreateProductData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMetadataChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      metadata: {
        weight: prev.metadata?.weight || 0,
        dimensions: prev.metadata?.dimensions || { length: 0, width: 0, height: 0 },
        materials: prev.metadata?.materials || [],
        [field]: value,
      },
    }));
  };

  const handleDimensionChange = (dimension: 'length' | 'width' | 'height') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      metadata: {
        weight: prev.metadata?.weight || 0,
        materials: prev.metadata?.materials || [],
        dimensions: {
          length: prev.metadata?.dimensions?.length || 0,
          width: prev.metadata?.dimensions?.width || 0,
          height: prev.metadata?.dimensions?.height || 0,
          [dimension]: value,
        },
      },
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const addMaterial = () => {
    if (materialInput.trim() && !materials.includes(materialInput.trim())) {
      setMaterials(prev => [...prev, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const removeMaterial = (materialToRemove: string) => {
    setMaterials(prev => prev.filter(material => material !== materialToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-text-primary mb-2">
            {t('fields.code')} *
          </label>
          <input
            type="text"
            id="code"
            value={formData.code}
            onChange={handleInputChange('code')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              errors.code ? 'border-red-300 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder={t('placeholders.code')}
          />
          {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            {t('fields.name')} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder={t('placeholders.name')}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
          {t('fields.description')} *
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange('description')}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors resize-none ${
            errors.description ? 'border-red-300 bg-red-50' : 'border-neutral-300'
          }`}
          placeholder={t('placeholders.description')}
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Pricing and Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-text-primary mb-2">
            {t('fields.price')} *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">$</span>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={handleInputChange('price')}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                errors.price ? 'border-red-300 bg-red-50' : 'border-neutral-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-text-primary mb-2">
            {t('fields.stock')} *
          </label>
          <input
            type="number"
            id="stock"
            min="0"
            value={formData.stock || ''}
            onChange={handleInputChange('stock')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              errors.stock ? 'border-red-300 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
            {t('fields.category')} *
          </label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={handleInputChange('categoryId')}
            disabled={loadingCategories}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              errors.categoryId ? 'border-red-300 bg-red-50' : 'border-neutral-300'
            }`}
          >
            <option value="">{loadingCategories ? t('loading') : t('selectCategory')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {categoriesT(category.key)}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
        </div>
      </div>

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
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-text-primary mb-2">
            {t('fields.tags')}
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              placeholder={t('placeholders.tags')}
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
            {tags.map((tag) => (
              <span
                key={tag}
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
            {t('fields.materials')}
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="materials"
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              placeholder={t('placeholders.materials')}
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
            {materials.map((material) => (
              <span
                key={material}
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
            {t('fields.weight')}
          </label>
          <div className="relative">
            <input
              type="number"
              id="weight"
              min="0"
              step="0.01"
              value={formData.metadata?.weight || ''}
              onChange={handleMetadataChange('weight')}
              className="w-full px-3 py-2 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted">kg</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t('fields.dimensions')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.metadata?.dimensions?.length || ''}
                onChange={handleDimensionChange('length')}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm"
                placeholder={t('placeholders.length')}
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.metadata?.dimensions?.width || ''}
                onChange={handleDimensionChange('width')}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm"
                placeholder={t('placeholders.width')}
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.metadata?.dimensions?.height || ''}
                onChange={handleDimensionChange('height')}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm"
                placeholder={t('placeholders.height')}
              />
            </div>
          </div>
          <p className="text-xs text-text-muted mt-1">{t('helpers.dimensions')}</p>
        </div>
      </div>

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
    </form>
  );
}