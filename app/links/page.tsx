import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FiGlobe } from 'react-icons/fi';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import OxalLogo from '@/components/OxalLogo';
import LocationMap from '@/components/LocationMap';

export const metadata: Metadata = {
  title: 'Oxal - Todos Nuestros Enlaces',
  description: 'Descubre todos nuestros canales: tienda web, Instagram, Facebook y ubicación.',
  keywords: 'Oxal, accesorios, enlaces, tienda, redes sociales',
  openGraph: {
    title: 'Oxal - Todos Nuestros Enlaces',
    description: 'Descubre todos nuestros canales: tienda web, Instagram, Facebook y ubicación.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Oxal - Todos Nuestros Enlaces',
      },
    ],
  },
};

export default function Links() {
  const t = useTranslations('links');

  const links = [
    {
      id: 1,
      titleKey: 'website.title',
      descriptionKey: 'website.description',
      href: '/',
      icon: 'globe',
      color: 'bg-oxal-teak text-white',
    },
    {
      id: 2,
      titleKey: 'instagram.title',
      descriptionKey: 'instagram.description',
      href: 'https://www.instagram.com/shop.oxal/',
      icon: 'instagram',
      color: 'bg-oxal-verdigris text-white',
      external: true,
    },
    {
      id: 3,
      titleKey: 'facebook.title',
      descriptionKey: 'facebook.description',
      href: 'https://www.facebook.com/accesoriosOxal/',
      icon: 'facebook',
      color: 'bg-oxal-desert text-white',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-oxal-cream py-12 px-4">
      <div className="max-w-xl mx-auto overflow-hidden bg-oxal-sandstone rounded-3xl shadow-lg">
        <div className="pt-8 pb-6 px-8 text-center bg-gradient-to-b from-oxal-verdigris to-oxal-desert">
          <div className="mb-6">
            <div className="w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
              <OxalLogo width={480} height={480} fill="#f4f0ea" />
            </div>
          </div>

          <p className="text-2xl text-oxal-accent mb-2">
            {t('tagline')}
          </p>

          <p className="text-oxal-accent leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="px-8 py-8 bg-oxal-sandstone">
          <div className="space-y-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={`block p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group ${link.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">
                    {link.icon === 'instagram' ? (
                      <FaInstagram size={32} />
                    ) : link.icon === 'facebook' ? (
                      <FaFacebook size={32} />
                    ) : link.icon === 'globe' ? (
                      <FiGlobe size={32} />
                    ) : (
                      link.icon
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform">
                      {t(link.titleKey)}
                    </h3>
                  </div>
                  <div className="text-xl flex-shrink-0 group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-8">
            <LocationMap height="h-80" ariaLabel={t('location.mapAriaLabel')} />
          </div>

          <div className="mt-8 pt-6 border-t border-oxal-accent flex justify-center gap-6">
            <a
              href="https://www.instagram.com/shop.oxal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oxal-accent hover:text-oxal-desert transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.facebook.com/accesoriosOxal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oxal-accent hover:text-oxal-desert transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook size={24} />
            </a>
          </div>

          <div className="mt-6 text-center text-sm text-oxal-accent">
            <p>{t('copyright')}</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex fixed bottom-6 right-6 flex-col items-center">
        <p className="text-xs text-oxal-primary font-semibold mb-2">{t('viewInMobile')}</p>
        <div className="w-40 h-40 bg-oxal-cream rounded-lg p-2 flex items-center justify-center">
          <Image
            src="/links-qr-code.png"
            alt="Links QR Code"
            width={120}
            height={120}
            quality={75}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
