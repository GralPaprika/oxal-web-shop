'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import type { CreateProductData } from '@/domain/product/product.entity';

interface MetadataFieldsProps {
  formData: CreateProductData;
  onFormDataChange: (data: CreateProductData) => void;
}

export function MetadataFields({ formData, onFormDataChange }: MetadataFieldsProps) {
  const t = useTranslations('admin.products');
  const handleMetadataChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    onFormDataChange({
      ...formData,
      metadata: {
        weight: formData.metadata?.weight || 0,
        dimensions: formData.metadata?.dimensions || { length: 0, width: 0, height: 0 },
        materials: formData.metadata?.materials || [],
        [field]: value,
      },
    });
  };

  const handleDimensionChange = (dimension: 'length' | 'width' | 'height') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    onFormDataChange({
      ...formData,
      metadata: {
        weight: formData.metadata?.weight || 0,
        materials: formData.metadata?.materials || [],
        dimensions: {
          length: formData.metadata?.dimensions?.length || 0,
          width: formData.metadata?.dimensions?.width || 0,
          height: formData.metadata?.dimensions?.height || 0,
          [dimension]: value,
        },
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label={t('form.metadata.fields.weight')}
        type="number"
        id="weight"
        min="0"
        step="0.01"
        value={formData.metadata?.weight || ''}
        onChange={handleMetadataChange('weight')}
        placeholder="0.00"
        suffix="kg"
      />

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t('form.metadata.fields.dimensions')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.metadata?.dimensions?.length || ''}
            onChange={handleDimensionChange('length')}
            placeholder={t('form.metadata.placeholders.length')}
            variant="small"
          />
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.metadata?.dimensions?.width || ''}
            onChange={handleDimensionChange('width')}
            placeholder={t('form.metadata.placeholders.width')}
            variant="small"
          />
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.metadata?.dimensions?.height || ''}
            onChange={handleDimensionChange('height')}
            placeholder={t('form.metadata.placeholders.height')}
            variant="small"
          />
        </div>
        <p className="text-xs text-text-muted mt-1">{t('form.metadata.helpers.dimensions')}</p>
      </div>
    </div>
  );
}