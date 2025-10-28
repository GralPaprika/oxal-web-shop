'use client';

import { Input, TextArea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { CreateProductData, ProductCategory } from '@/domain/product/product.entity';

interface ProductFormFieldsProps {
  formData: CreateProductData;
  onFormDataChange: (data: CreateProductData) => void;
  categories: ProductCategory[];
  loadingCategories: boolean;
  errors: Record<string, string>;
  translations: {
    fields: {
      code: string;
      name: string;
      description: string;
      price: string;
      stock: string;
      category: string;
      isStarred: string;
      badge: string;
    };
    placeholders: {
      code: string;
      name: string;
      description: string;
    };
    badges: {
      none: string;
      new: string;
      sale: string;
    };
    selectCategory: string;
    loading: string;
  };
  categoriesTranslations: (key: string) => string;
}

export function ProductFormFields({
  formData,
  onFormDataChange,
  categories,
  loadingCategories,
  errors,
  translations,
  categoriesTranslations,
}: ProductFormFieldsProps) {
  const handleInputChange = (field: keyof CreateProductData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onFormDataChange({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (field: keyof CreateProductData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFormDataChange({ ...formData, [field]: e.target.checked });
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? null : e.target.value as 'new' | 'sale';
    onFormDataChange({ ...formData, badge: value });
  };

  return (
    <>
      {/* Code and Name */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Input
            label={translations.fields.code}
            type="text"
            id="code"
            value={formData.code}
            onChange={handleInputChange('code')}
            placeholder={translations.placeholders.code}
            error={errors.code}
            required
          />
        </div>

        <div className="md:col-span-3">
          <Input
            label={translations.fields.name}
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder={translations.placeholders.name}
            error={errors.name}
            required
          />
        </div>
      </div>

      {/* Description */}
      <TextArea
        label={translations.fields.description}
        id="description"
        rows={3}
        value={formData.description || ''}
        onChange={handleInputChange('description')}
        placeholder={translations.placeholders.description}
        error={errors.description}
      />

      {/* Price, Stock, Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label={translations.fields.price}
          type="number"
          id="price"
          min="0"
          step="0.01"
          value={formData.price || ''}
          onChange={handleInputChange('price')}
          placeholder="0.00"
          prefix="$"
          error={errors.price}
          required
        />

        <Input
          label={translations.fields.stock}
          type="number"
          id="stock"
          min="0"
          value={formData.stock || ''}
          onChange={handleInputChange('stock')}
          placeholder="0"
          error={errors.stock}
          required
        />

        <Select
          label={translations.fields.category}
          id="category"
          value={formData.categoryId}
          onChange={handleInputChange('categoryId')}
          disabled={loadingCategories}
          error={errors.categoryId}
          required
          options={[
            { label: loadingCategories ? translations.loading : translations.selectCategory, value: '', disabled: true },
            ...categories.map((category) => ({
              label: categoriesTranslations(category.key),
              value: category.id,
            }))
          ]}
        />
      </div>

      {/* Marketing Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isStarred"
            checked={formData.isStarred || false}
            onChange={handleCheckboxChange('isStarred')}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="isStarred" className="text-sm font-medium text-gray-700">
            {translations.fields.isStarred}
          </label>
        </div>

        <Select
          label={translations.fields.badge}
          id="badge"
          value={formData.badge || ''}
          onChange={handleBadgeChange}
          options={[
            { label: translations.badges.none, value: '' },
            { label: translations.badges.new, value: 'new' },
            { label: translations.badges.sale, value: 'sale' }
          ]}
        />
      </div>
    </>
  );
}