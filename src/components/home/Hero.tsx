'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-text-primary mb-6">
            Estilo
            <span className="text-primary-600 block">Bohemio</span>
            Auténtico
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Descubre nuestra colección única de productos artesanales 
            que combinan elegancia y espíritu libre
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/products"
              className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              Explorar colección
            </Link>
            <Link
              href="/about"
              className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Nuestra historia
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Naturales</h3>
              <p className="text-text-secondary">Productos hechos con materiales sostenibles</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✋</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Artesanales</h3>
              <p className="text-text-secondary">Creados a mano por artesanos expertos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Únicos</h3>
              <p className="text-text-secondary">Diseños exclusivos que reflejan tu personalidad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-600 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}