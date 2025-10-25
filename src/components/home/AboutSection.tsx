'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AboutSection() {
  return (
    <section className="py-16 bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-6">
              Nuestra historia
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Nacimos con la misión de conectar el espíritu bohemio con la elegancia moderna. 
              Cada producto en nuestra colección cuenta una historia única, creada por artesanos 
              apasionados que ponen su corazón en cada detalle.
            </p>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Creemos en la belleza de lo auténtico, en la magia de lo hecho a mano y en el 
              poder transformador de los objetos que nos rodean. Nuestro compromiso es traerte 
              piezas que no solo embellezcan tu espacio, sino que también alimenten tu alma.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Calidad garantizada</h4>
                  <p className="text-sm text-text-secondary">Productos seleccionados con los más altos estándares</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Comercio justo</h4>
                  <p className="text-sm text-text-secondary">Apoyamos a comunidades artesanales</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Sostenibilidad</h4>
                  <p className="text-sm text-text-secondary">Materiales eco-friendly y procesos responsables</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Diseño único</h4>
                  <p className="text-sm text-text-secondary">Piezas exclusivas que no encontrarás en otro lugar</p>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Conoce más sobre nosotros
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                  alt="Taller de artesanías"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-200 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}