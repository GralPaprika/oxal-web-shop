'use client';

import { useTranslations } from 'next-intl';
import { Input, TextArea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { CreateProductData, ProductCategory } from '@/domain/product/product.entity';

interface ProductFormFieldsProps {
  formData: CreateProductData;
  onFormDataChange: (data: CreateProductData) => void;
  categories: ProductCategory[];
  loadingCategories: boolean;
  errors: Record<string, string>;
  translations?: {
    selectCategory?: string;
    loading?: string;
  };
  categoriesTranslations: (key: string) => string;
  onStarToggle?: (newStarState: boolean) => Promise<boolean>;
}

export function ProductFormFields({
  formData,
  onFormDataChange,
  categories,
  loadingCategories,
  errors,
  translations,
  categoriesTranslations,
  onStarToggle,
}: ProductFormFieldsProps) {
  const t = useTranslations('admin.products');

  const handleInputChange = (field: keyof CreateProductData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onFormDataChange({ ...formData, [field]: value });
  };

  const handleStarClick = async () => {
    const newStarState = !formData.isStarred;
    
    if (onStarToggle) {
      const isAllowed = await onStarToggle(newStarState);
      if (isAllowed) {
        onFormDataChange({ ...formData, isStarred: newStarState });
      }
    } else {
      onFormDataChange({ ...formData, isStarred: newStarState });
    }
  };

  return (
    <div className="relative pt-12">
      <button
        type="button"
        onClick={handleStarClick}
        className="absolute top-2 right-2 z-10 p-2 transition-all duration-300 transform hover:scale-110 group"
        title={formData.isStarred ? t('form.starButton.remove') : t('form.starButton.add')}
      >
        {formData.isStarred ? (
          <StarIconSolid className="w-8 h-8 text-yellow-500 drop-shadow-lg transition-all duration-500 transform hover:rotate-12 animate-pulse" />
        ) : (
          <StarIcon className="w-8 h-8 text-gray-300 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300" />
        )}
        {formData.isStarred && (
          <div className="absolute inset-0 w-8 h-8 bg-yellow-400 rounded-full opacity-20 blur-sm animate-ping"></div>
        )}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Input
            label={t('form.fields.code')}
            type="text"
            id="code"
            value={formData.code}
            onChange={handleInputChange('code')}
            placeholder={t('form.placeholders.code')}
            error={errors.code}
            required
          />
        </div>

        <div className="md:col-span-3">
          <Input
            label={t('form.fields.name')}
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder={t('form.placeholders.name')}
            error={errors.name}
            required
          />
        </div>
      </div>

      <TextArea
        label={t('form.fields.description')}
        id="description"
        rows={3}
        value={formData.description || ''}
        onChange={handleInputChange('description')}
        placeholder={t('form.placeholders.description')}
        error={errors.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label={t('form.fields.price')}
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
          label={t('form.fields.stock')}
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
          label={t('form.fields.category')}
          id="category"
          value={formData.categoryId}
          onChange={handleInputChange('categoryId')}
          disabled={loadingCategories}
          error={errors.categoryId}
          required
          options={[
            { label: loadingCategories ? t('form.loading') : (translations?.selectCategory ?? t('form.selectCategory')), value: '', disabled: true },
            ...categories.map((category) => ({
              label: categoriesTranslations(category.key),
              value: category.id,
            }))
          ]}
        />
      </div>

      <div className="space-y-3 mt-8">
        <label className="block text-sm font-medium text-gray-700">
          {t('form.fields.badge')}
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onFormDataChange({ ...formData, badge: formData.badge === 'new' ? null : 'new' })}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
              formData.badge === 'new'
                ? 'border-green-500 bg-green-500 text-white shadow-md scale-105'
                : 'border-green-200 bg-green-50 text-green-600 hover:border-green-300 hover:bg-green-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              formData.badge === 'new' ? 'bg-white' : 'bg-green-500'
            }`}></div>
            {t('form.badges.new')}
          </button>

          <button
            type="button"
            onClick={() => onFormDataChange({ ...formData, badge: formData.badge === 'sale' ? null : 'sale' })}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
              formData.badge === 'sale'
                ? 'border-red-500 bg-red-500 text-white shadow-md scale-105'
                : 'border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              formData.badge === 'sale' ? 'bg-white' : 'bg-red-500'
            }`}></div>
            {t('form.badges.sale')}
          </button>
        </div>
        {formData.badge && (
          <p className="text-xs text-gray-500 italic">
            {t('form.badgeHint')}
          </p>
        )}
      </div>
    </div>
  );
}