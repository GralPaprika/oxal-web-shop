'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, StarIcon, ChevronDownIcon, XMarkIcon, SparklesIcon, TagIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, SparklesIcon as SparklesIconSolid, TagIcon as TagIconSolid, ExclamationTriangleIcon as ExclamationTriangleIconSolid } from '@heroicons/react/24/solid';

interface SearchFormProps {
  searchTerm: string;
  selectedCategory: string;
  selectedFilters: {
    starred: boolean;
    new: boolean;
    sale: boolean;
    lowStock: boolean;
  };
  categories: Array<{ id: string; name: string }>;
  onSearch: (search: string, category: string, filters: { starred: boolean; new: boolean; sale: boolean; lowStock: boolean }) => void;
  translations: {
    searchPlaceholder: string;
    search: string;
    filters: string;
    clearFilters: string;
    allCategories: string;
    filterOptions: {
      starred: string;
      new: string;
      sale: string;
      lowStock: string;
    };
  };
}

export function SearchForm({
  searchTerm,
  selectedCategory,
  selectedFilters,
  categories,
  onSearch,
  translations
}: SearchFormProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);
  const [localFilters, setLocalFilters] = useState(selectedFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options configuration
  const filterOptions = [
    { key: 'starred' as const, label: translations.filterOptions.starred, icon: StarIcon, solidIcon: StarIconSolid, color: 'text-amber-500' },
    { key: 'new' as const, label: translations.filterOptions.new, icon: SparklesIcon, solidIcon: SparklesIconSolid, color: 'text-green-600' },
    { key: 'sale' as const, label: translations.filterOptions.sale, icon: TagIcon, solidIcon: TagIconSolid, color: 'text-red-600' },
    { key: 'lowStock' as const, label: translations.filterOptions.lowStock, icon: ExclamationTriangleIcon, solidIcon: ExclamationTriangleIconSolid, color: 'text-orange-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm.trim(), localSelectedCategory, localFilters);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  const handleCategoryChange = (value: string) => {
    setLocalSelectedCategory(value);
    onSearch(localSearchTerm.trim(), value, localFilters);
  };

  const handleFilterChange = (filterType: keyof typeof localFilters) => {
    const newFilters = { ...localFilters, [filterType]: !localFilters[filterType] };
    setLocalFilters(newFilters);
    onSearch(localSearchTerm.trim(), localSelectedCategory, newFilters);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm('');
    setLocalSelectedCategory('');
    const clearedFilters = { starred: false, new: false, sale: false, lowStock: false };
    setLocalFilters(clearedFilters);
    onSearch('', '', clearedFilters);
  };

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
          
          {/* Modern Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                Object.values(localFilters).some(Boolean)
                  ? 'border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              <span>{translations.filters}</span>
              {Object.values(localFilters).some(Boolean) && (
                <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {Object.values(localFilters).filter(Boolean).length}
                </span>
              )}
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="space-y-1">
                    {filterOptions.map((option) => {
                      const isSelected = localFilters[option.key];
                      
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange(option.key);
                          }}
                          className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors w-full text-left ${
                            isSelected ? 'bg-amber-50 border border-amber-200' : 'hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {isSelected ? (
                              option.solidIcon && <option.solidIcon className={`h-4 w-4 ${option.color}`} />
                            ) : (
                              option.icon && <option.icon className={`h-4 w-4 ${option.color}`} />
                            )}
                            <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                              {option.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Clear Filters Button */}
                  {Object.values(localFilters).some(Boolean) && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={() => {
                          handleClearFilters();
                          setIsFilterOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-2 py-1 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        {translations.clearFilters}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
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