'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const categories = [
  {
    id: 1,
    name: 'ropa',
    image: 'https://www.tonkettitrading.com.au/cdn/shop/files/DSC08594.jpg?v=1725238478',
    href: '/categories/ropa',
  },
  {
    id: 2,
    name: 'joyeria',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    href: '/categories/joyeria',
  },
  {
    id: 3,
    name: 'accesorios',
    image: 'https://m.media-amazon.com/images/I/91liVv+emhS._AC_UY1000_.jpg',
    href: '/categories/accesorios',
  },
];

export function FeaturedCategories() {
  const t = useTranslations('categories');

  return (
    <section className="py-16 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col items-center"
            >
              <div className="relative w-56 h-56 md:w-80 md:h-80 mb-4">
                <div className="w-full h-full rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <Image
                    src={category.image}
                    alt={t(`categories.${category.name}`)}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary text-center group-hover:text-primary-600 transition-colors duration-300">
                {t(`categories.${category.name}`)}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}