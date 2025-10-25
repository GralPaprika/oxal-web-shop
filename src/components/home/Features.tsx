'use client';

import { useTranslations } from 'next-intl';

const features = [
  {
    icon: '🚚',
    titleKey: 'shipping.title',
    descriptionKey: 'shipping.description',
  },
  {
    icon: '🔄',
    titleKey: 'returns.title',
    descriptionKey: 'returns.description',
  },
  {
    icon: '🛡️',
    titleKey: 'payment.title',
    descriptionKey: 'payment.description',
  },
  {
    icon: '💬',
    titleKey: 'support.title',
    descriptionKey: 'support.description',
  },
  {
    icon: '🌱',
    titleKey: 'sustainable.title',
    descriptionKey: 'sustainable.description',
  },
  {
    icon: '⭐',
    titleKey: 'quality.title',
    descriptionKey: 'quality.description',
  },
];

export function Features() {
  const t = useTranslations('features');

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{feature.icon}</span>
              </div>

              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            {t('cta.title')}
          </h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hola@oxal.com"
              className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
            >
              {t('cta.email')}
            </a>
            <a
              href="tel:+34900123456"
              className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
            >
              {t('cta.phone')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}