const features = [
  {
    icon: '🚚',
    title: 'Envío gratuito',
    description: 'En pedidos superiores a $75. Envíos rápidos y seguros a toda España.',
  },
  {
    icon: '🔄',
    title: 'Devoluciones fáciles',
    description: '30 días para devolver tu compra sin preguntas. Tu satisfacción es lo primero.',
  },
  {
    icon: '🛡️',
    title: 'Pago seguro',
    description: 'Múltiples métodos de pago con encriptación SSL. Compra con total confianza.',
  },
  {
    icon: '💬',
    title: 'Atención personalizada',
    description: 'Nuestro equipo está aquí para ayudarte. Contacto directo y respuesta rápida.',
  },
  {
    icon: '🌱',
    title: 'Productos sostenibles',
    description: 'Comprometidos con el medio ambiente. Materiales eco-friendly y empaques reciclables.',
  },
  {
    icon: '⭐',
    title: 'Calidad premium',
    description: 'Productos cuidadosamente seleccionados. Artesanía de la más alta calidad.',
  },
];

export function Features() {
  return (
    <section className="py-16 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Nos comprometemos a brindarte la mejor experiencia de compra con productos únicos y servicio excepcional
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            ¿Tienes alguna pregunta?
          </h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Nuestro equipo de atención al cliente está aquí para ayudarte con cualquier consulta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hola@oxal.com"
              className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
            >
              Envíanos un email
            </a>
            <a
              href="tel:+34900123456"
              className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
            >
              Llámanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}