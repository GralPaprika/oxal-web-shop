'use client';

import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchFormProps {
  searchTerm: string;
  selectedCategory: string;
  categories: Array<{ id: string; name: string }>;
  translations: {
    searchPlaceholder: string;
    search: string;
    filters: string;
    allCategories: string;
  };
}

export function SearchForm({
  searchTerm,
  selectedCategory,
  categories,
  translations
}: SearchFormProps) {
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    const search = formData.get('search') as string;
    const category = formData.get('category') as string;

    const params = new URLSearchParams();
    if (search?.trim()) {
      params.set('search', search.trim());
    }
    if (category && category !== '') {
      params.set('category', category);
    }

    const queryString = params.toString();
    router.push(`/admin/products${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
      <form
        action={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              name="search"
              defaultValue={searchTerm}
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
          <button type="button" className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
            <FunnelIcon className="h-4 w-4" />
            {translations.filters}
          </button>
          <select
            name="category"
            defaultValue={selectedCategory}
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