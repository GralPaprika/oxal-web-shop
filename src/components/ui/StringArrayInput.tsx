'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface StringArrayInputProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function StringArrayInput({ 
  items, 
  onItemsChange, 
  placeholder, 
  label,
  id 
}: StringArrayInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      onItemsChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (itemToRemove: string) => {
    onItemsChange(items.filter(item => item !== itemToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
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