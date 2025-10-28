'use client';

import type { CreateProductData } from '@/domain/product/product.entity';

interface MetadataFieldsProps {
  formData: CreateProductData;
  onFormDataChange: (data: CreateProductData) => void;
  translations: {
    fields: {
      weight: string;
      dimensions: string;
    };
    placeholders: {
      length: string;
      width: string;
      height: string;
    };
    helpers: {
      dimensions: string;
    };
  };
}

export function MetadataFields({ formData, onFormDataChange, translations }: MetadataFieldsProps) {
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
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-text-primary mb-2">
          {translations.fields.weight}
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
          {translations.fields.dimensions}
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
              placeholder={translations.placeholders.length}
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
              placeholder={translations.placeholders.width}
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
              placeholder={translations.placeholders.height}
            />
          </div>
        </div>
        <p className="text-xs text-text-muted mt-1">{translations.helpers.dimensions}</p>
      </div>
    </div>
  );
}