'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 1,
    name: 'Joyería',
    description: 'Piezas únicas y elegantes',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',
    href: '/categories/jewelry',
  },
  {
    id: 2,
    name: 'Decoración',
    description: 'Para tu hogar bohemio',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
    href: '/categories/decor',
  },
  {
    id: 3,
    name: 'Textiles',
    description: 'Telas y accesorios',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    href: '/categories/textiles',
  },
  {
    id: 4,
    name: 'Bienestar',
    description: 'Cuidado natural',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
    href: '/categories/wellness',
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
            Explora por categorías
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas en nuestra selección cuidadosamente curada
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-primary-600 px-4 py-2 rounded-full font-semibold shadow-lg">
                  Ver más
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            Ver todas las categorías
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}