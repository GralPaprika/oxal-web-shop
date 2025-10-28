'use client';

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
    };
    placeholders: {
      code: string;
      name: string;
      description: string;
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

  return (
    <>
      {/* Code and Name */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <label htmlFor="code" className="block text-sm font-medium text-text-primary mb-2">
            {translations.fields.code} *
          </label>
          <input
            type="text"
            id="code"
            value={formData.code}
            onChange={handleInputChange('code')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              errors.code ? 'border-red-300 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder={translations.placeholders.code}
            required
          />
          {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
        </div>

        <div className="md:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            {translations.fields.name} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder={translations.placeholders.name}
            required
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
          {translations.fields.description}
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description || ''}
          onChange={handleInputChange('description')}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors resize-none ${
            errors.description ? 'border-red-300 bg-red-50' : 'border-neutral-300'
          }`}
          placeholder={translations.placeholders.description}
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Price, Stock, Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-text-primary mb-2">
            {translations.fields.price} *
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
              required
            />
          </div>
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-text-primary mb-2">
            {translations.fields.stock} *
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
            required
          />
          {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
            {translations.fields.category} *
          </label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={handleInputChange('categoryId')}
            disabled={loadingCategories}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              errors.categoryId ? 'border-red-300 bg-red-50' : 'border-neutral-300'
            }`}
            required
          >
            <option value="">{loadingCategories ? translations.loading : translations.selectCategory}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {categoriesTranslations(category.key)}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
        </div>
      </div>
    </>
  );
}