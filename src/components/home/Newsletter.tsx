'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the newsletter subscription
    console.log('Newsletter subscription:', email);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-oxal-verdigris to-oxal-desert">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Mantente al día
          </h2>
          <p className="text-lg text-oxal-sandstone max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y sé el primero en conocer nuevos productos, 
            ofertas exclusivas y consejos de estilo bohemio
          </p>
        </div>

        {/* Newsletter form */}
        <div className="max-w-md mx-auto">
          {isSubmitted ? (
            <div className="bg-white/20 text-white p-4 rounded-full">
              <p className="font-semibold">¡Gracias por suscribirte! 🎉</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu dirección de email"
                required
                className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-oxal-verdigris px-8 py-3 rounded-full font-semibold hover:bg-oxal-cream transition-colors shadow-lg"
              >
                Suscribirse
              </button>
            </form>
          )}
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-xl">📧</span>
            </div>
            <h4 className="font-semibold mb-1">Ofertas exclusivas</h4>
            <p className="text-sm text-oxal-sandstone">Descuentos especiales solo para suscriptores</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-xl">⚡</span>
            </div>
            <h4 className="font-semibold mb-1">Primeras noticias</h4>
            <p className="text-sm text-oxal-sandstone">Entérate antes que nadie de nuevos lanzamientos</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-xl">💡</span>
            </div>
            <h4 className="font-semibold mb-1">Tips de estilo</h4>
            <p className="text-sm text-oxal-sandstone">Consejos para crear tu look bohemio perfecto</p>
          </div>
        </div>

        {/* Privacy note */}
        <p className="text-sm text-oxal-sandstone mt-8">
          No compartimos tu información con terceros. Puedes darte de baja en cualquier momento.
        </p>
      </div>
    </section>
  );
}