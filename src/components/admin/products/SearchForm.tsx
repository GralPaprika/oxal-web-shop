'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchFormProps {
  searchTerm: string;
  selectedCategory: string;
  categories: Array<{ id: string; name: string }>;
  onSearch: (search: string, category: string) => void;
  translations: {
    searchPlaceholder: string;
    search: string;
    filters: string;
    clearFilters: string;
    allCategories: string;
  };
}

export function SearchForm({
  searchTerm,
  selectedCategory,
  categories,
  onSearch,
  translations
}: SearchFormProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm.trim(), localSelectedCategory);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  const handleCategoryChange = (value: string) => {
    setLocalSelectedCategory(value);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm('');
    setLocalSelectedCategory('');
    onSearch('', '');
  };

  const hasActiveFilters = localSearchTerm.trim() !== '' || localSelectedCategory !== '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              name="search"
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
            <MagnifyingGlassIcon className="h-4 w-4" />
            {translations.search}
          </button>
          <button 
            type="button" 
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                : 'border-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            {hasActiveFilters ? translations.clearFilters : translations.filters}
          </button>
          <select
            name="category"
            value={localSelectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">{translations.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}