'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MaterialsInputProps {
  materials: string[];
  onMaterialsChange: (materials: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function MaterialsInput({ materials, onMaterialsChange, placeholder, label }: MaterialsInputProps) {
  const [materialInput, setMaterialInput] = useState('');

  const addMaterial = () => {
    if (materialInput.trim() && !materials.includes(materialInput.trim())) {
      onMaterialsChange([...materials, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const removeMaterial = (materialToRemove: string) => {
    onMaterialsChange(materials.filter(material => material !== materialToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMaterial();
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={materialInput}
          onChange={(e) => setMaterialInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          placeholder={placeholder}
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
  );
}