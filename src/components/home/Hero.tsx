'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1516762689617-e1cffcef479d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-75"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
            {t('title.line1')}
            <span className="text-amber-300 block">{t('title.line2')}</span>
            {t('title.line3')}
          </h1>

          <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="flex justify-center items-center mb-12">
            <Link
              href="/products"
              className="bg-amber-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-800 transition-colors shadow-lg"
            >
              {t('cta')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-6">
                <span className="text-4xl block mb-2">🌿</span>
                <div className="w-12 h-0.5 bg-amber-300 mx-auto opacity-60"></div>
              </div>
              <h3 className="font-semibold text-white mb-3 text-xl">{t('features.natural.title')}</h3>
              <p className="text-amber-100 text-base leading-relaxed">{t('features.natural.description')}</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <span className="text-4xl block mb-2">✋</span>
                <div className="w-12 h-0.5 bg-amber-300 mx-auto opacity-60"></div>
              </div>
              <h3 className="font-semibold text-white mb-3 text-xl">{t('features.handmade.title')}</h3>
              <p className="text-amber-100 text-base leading-relaxed">{t('features.handmade.description')}</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <span className="text-4xl block mb-2">💎</span>
                <div className="w-12 h-0.5 bg-amber-300 mx-auto opacity-60"></div>
              </div>
              <h3 className="font-semibold text-white mb-3 text-xl">{t('features.unique.title')}</h3>
              <p className="text-amber-100 text-base leading-relaxed">{t('features.unique.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}